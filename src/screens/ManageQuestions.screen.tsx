import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Question, LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';
import Button from '../components/Button.component';
import QuestionCard from '../components/QuestionCard.component';
import FilterSection from '../components/FilterSection.component';
import Input from '../components/Input.component';
import { useQuestions } from '../hooks/useQuestion';
import { useCategories } from '../hooks/useCategories';
import { useNavigation } from '@react-navigation/native';

const ManageQuestionsScreen = () => {
  const { 
    questions, 
    loading, 
    error, 
    createQuestion, 
    updateQuestion, 
    deleteQuestion,
    loadQuestions
  } = useQuestions();

  const { categories, loading: categoriesLoading } = useCategories();
  const navigation = useNavigation();

  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Contar filtros activos
  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all', 
    selectedType !== 'all'
  ].filter(Boolean).length;

  // Filtrar preguntas
  const filteredQuestions = questions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.categoryId === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || question.category?.level === selectedLevel;
    const matchesType = selectedType === 'all' || question.category?.type === selectedType;
    
    return matchesCategory && matchesLevel && matchesType;
  });

  const handleCreateQuestionRedirect = () => {
    navigation.navigate('CreateQuestionScreen' as never);
  };

  const handleQuestionPress = (question: Question) => {
    navigation.navigate({
      name: 'QuestionDetail',
      params: {
        questionId: question.id,
        question: question
      }
    } as never);
  };
  const handleDeleteQuestion = async (questionId: string) => {
    Alert.alert(
      'Eliminar Pregunta',
      '¿Estás seguro de que quieres eliminar esta pregunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(questionId);
              Alert.alert('Éxito', 'Pregunta eliminada correctamente');
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar la pregunta');
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async (questionId: string) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        await updateQuestion(questionId, { active: !question.active });
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la pregunta');
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedType('all');
    setFiltersModalVisible(false);
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.descriptionCategory
  }));

  const levelOptions = Object.values(LevelCategoryQuestion).map(level => ({
    value: level,
    label: level
  }));

  const typeOptions = Object.values(TypeQuestionCategory).map(type => ({
    value: type,
    label: type
  }));

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <QuestionCard
      question={item}
      onEdit={handleQuestionPress}
      onDelete={handleDeleteQuestion}
      onToggleActive={handleToggleActive}
      onPress={handleQuestionPress}
    />
  );

  // Mostrar loading mientras se cargan los datos
  if (loading || categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  // Mostrar error si hay problema cargando los datos
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar las preguntas</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Button
          title="Reintentar"
          variant="primary"
          onPress={loadQuestions}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Preguntas</Text>
        <Text style={styles.subtitle}>
          Total: {filteredQuestions.length} preguntas
        </Text>
      </View>

      {/* Búsqueda y Filtros */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar preguntas..."
          value={searchText}
          onChangeText={setSearchText}
          variant="outlined"
          style={styles.searchInput}
        />
        
        <TouchableOpacity 
          style={styles.filtersButton}
          onPress={() => setFiltersModalVisible(true)}
        >
          <Text style={styles.filtersButtonText}>
            Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Preguntas */}
      {filteredQuestions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron preguntas</Text>
          <Text style={styles.emptySubtext}>
            {searchText || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedType !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay preguntas disponibles'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredQuestions}
          renderItem={renderQuestionItem}
          keyExtractor={(item) => item.id}
          style={styles.questionsList}
          contentContainerStyle={styles.questionsContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadQuestions}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      )}

      {/* Botón Crear Pregunta - CORREGIDO */}
      <View style={styles.createButtonContainer}>
        <Button
          title="+ Crear Nueva Pregunta"
          variant="primary"
          size="large"
          onPress={handleCreateQuestionRedirect}
          style={styles.createButton}
        />
      </View>

      {/* Modal de Filtros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filtersModalVisible}
        onRequestClose={() => setFiltersModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setFiltersModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersScroll} showsVerticalScrollIndicator={false}>
              <FilterSection
                title="Categorías"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
              />

              <FilterSection
                title="Niveles"
                options={levelOptions}
                selectedValue={selectedLevel}
                onValueChange={setSelectedLevel}
              />

              <FilterSection
                title="Tipos"
                options={typeOptions}
                selectedValue={selectedType}
                onValueChange={setSelectedType}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Limpiar Filtros"
                variant="outlined"
                onPress={handleClearFilters}
                style={styles.clearButton}
              />
              <Button
                title="Aplicar Filtros"
                variant="primary"
                onPress={() => setFiltersModalVisible(false)}
                style={styles.applyButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF0000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  filtersButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 80,
    alignItems: 'center',
  },
  filtersButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  questionsList: {
    flex: 1,
  },
  questionsContent: {
    padding: 15,
    flexGrow: 1,
  },
  createButtonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  createButton: {
    width: '100%', // Esto asegura que ocupe todo el ancho disponible
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  filtersScroll: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default ManageQuestionsScreen;