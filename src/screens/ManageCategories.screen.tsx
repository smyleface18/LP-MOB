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
import { CategoryQuestion, LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';
import Button from '../components/Button.component';
import CategoryCard from '../components/CategoryCard.component';
import FilterSection from '../components/FilterSection.component';
import Input from '../components/Input.component';
import { useCategories } from '../hooks/useCategories';
import { useNavigation } from '@react-navigation/native';

const ManageCategoriesScreen = () => {
  const { 
    categories, 
    loading, 
    error, 
    updateCategory, 
    deleteCategory,
    loadCategories
  } = useCategories();

  const navigation = useNavigation();

  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Contar filtros activos
  const activeFiltersCount = [
    selectedLevel !== 'all', 
    selectedType !== 'all'
  ].filter(Boolean).length;

  // Filtrar categorías
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.descriptionCategory.toLowerCase().includes(searchText.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || category.level === selectedLevel;
    const matchesType = selectedType === 'all' || category.type === selectedType;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const handleCreateCategoryRedirect = () => {
    navigation.navigate('CreateCategoryScreen' as never);
  };

  const handleCategoryPress = (category: CategoryQuestion) => {
    navigation.navigate({name :'CategoryDetail', params : {
      categoryId: category.id,
      category: category
    }} as never);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Eliminar Categoría',
      '¿Estás seguro de que quieres eliminar esta categoría?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              Alert.alert('Éxito', 'Categoría eliminada correctamente');
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar la categoría');
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        await updateCategory(categoryId, { active: !category.active });
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la categoría');
    }
  };

  const handleClearFilters = () => {
    setSelectedLevel('all');
    setSelectedType('all');
    setFiltersModalVisible(false);
  };

  const levelOptions = Object.values(LevelCategoryQuestion).map(level => ({
    value: level,
    label: level
  }));

  const typeOptions = Object.values(TypeQuestionCategory).map(type => ({
    value: type,
    label: type
  }));

  const renderCategoryItem = ({ item }: { item: CategoryQuestion }) => (
    <CategoryCard
      category={item}
      onEdit={handleCategoryPress}
      onDelete={handleDeleteCategory}
      onToggleActive={handleToggleActive}
      onPress={handleCategoryPress}
    />
  );

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  // Mostrar error si hay problema cargando los datos
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar las categorías</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Button
          title="Reintentar"
          variant="primary"
          onPress={loadCategories}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Categorías</Text>
        <Text style={styles.subtitle}>
          Total: {filteredCategories.length} categorías
        </Text>
      </View>

      {/* Búsqueda y Filtros */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar categorías..."
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

      {/* Lista de Categorías */}
      {filteredCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron categorías</Text>
          <Text style={styles.emptySubtext}>
            {searchText || selectedLevel !== 'all' || selectedType !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay categorías disponibles'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadCategories}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      )}

      {/* Botón Crear Categoría */}
      <View style={styles.createButtonContainer}>
        <Button
          title="+ Crear Nueva Categoría"
          variant="primary"
          size="large"
          onPress={handleCreateCategoryRedirect}
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
    backgroundColor: '#000000',
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
  categoriesList: {
    flex: 1,
  },
  categoriesContent: {
    padding: 15,
    flexGrow: 1,
  },
  createButtonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  createButton: {
    width: '100%',
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
    maxHeight: '70%',
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
    maxHeight: 300,
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
export default ManageCategoriesScreen;