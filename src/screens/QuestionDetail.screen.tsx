import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Question, LevelCategoryQuestion, TypeQuestionCategory, CategoryQuestion } from '../types/type';
import Button from '../components/Button.component';
import Input from '../components/Input.component';
import FilterSection from '../components/FilterSection.component';
import { useCategories } from '../hooks/useCategories';
import { questionService } from '../services/question.service';

interface RouteParams {
  questionId: string;
  question?: Question;
}

const QuestionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { questionId, question: initialQuestion } = route.params as RouteParams;

  const { categories, loading: categoriesLoading } = useCategories();
  const [loading, setLoading] = useState(!initialQuestion);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState<Question | null>(initialQuestion || null);

  const [formData, setFormData] = useState({
    questionText: '',
    questionImage: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    categoryId: '',
    active: true
  });

  const [selectedLevel, setSelectedLevel] = useState<LevelCategoryQuestion | ''>('');
  const [selectedType, setSelectedType] = useState<TypeQuestionCategory | ''>('');

  // Cargar la pregunta si no viene en los params
  useEffect(() => {
    if (!initialQuestion && questionId) {
      loadQuestion();
    }
  }, [questionId, initialQuestion]);

  // Actualizar formData cuando la pregunta se carga
  useEffect(() => {
    if (question) {
      setFormData({
        questionText: question.questionText || '',
        questionImage: question.questionImage || '',
        options: [...question.options, '', '', ''].slice(0, 4), // Asegurar 4 opciones
        correctAnswer: question.correctAnswer,
        categoryId: question.categoryId,
        active: question.active
      });

      // Setear filtros basados en la categoría actual
      if (question.category) {
        setSelectedLevel(question.category.level);
        setSelectedType(question.category.type);
      }
    }
  }, [question]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const questionData = await questionService.getById(questionId);
      setQuestion(questionData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la pregunta');
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías basado en nivel y tipo seleccionados
  const filteredCategories = categories.filter(category => {
    const matchesLevel = !selectedLevel || category.level === selectedLevel;
    const matchesType = !selectedType || category.type === selectedType;
    return matchesLevel && matchesType;
  });

  const categoryOptions = filteredCategories.map(cat => ({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleAddOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: prev.correctAnswer === prev.options[index] ? '' : prev.correctAnswer
      }));
    }
  };

  const handleSetCorrectAnswer = (answer: string) => {
    setFormData(prev => ({
      ...prev,
      correctAnswer: answer
    }));
  };

  const validateForm = () => {
    if (!formData.questionText && !formData.questionImage) {
      Alert.alert('Error', 'Debe proporcionar texto de pregunta o imagen');
      return false;
    }

    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Debe proporcionar al menos 2 opciones');
      return false;
    }

    if (!formData.correctAnswer) {
      Alert.alert('Error', 'Debe seleccionar una respuesta correcta');
      return false;
    }

    if (!formData.categoryId) {
      Alert.alert('Error', 'Debe seleccionar una categoría');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        options: formData.options.filter(opt => opt.trim() !== '')
      };

      await questionService.update(questionId, submitData);
      Alert.alert('Éxito', 'Pregunta actualizada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la pregunta');
      console.error('Error updating question:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
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
              await questionService.delete(questionId);
              Alert.alert('Éxito', 'Pregunta eliminada correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la pregunta');
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async () => {
    try {
      setSaving(true);
      await questionService.update(questionId, { active: !formData.active });
      setFormData(prev => ({ ...prev, active: !prev.active }));
      Alert.alert('Éxito', `Pregunta ${!formData.active ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado de la pregunta');
    } finally {
      setSaving(false);
    }
  };

  if (loading || categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Cargando pregunta...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la pregunta</Text>
        <Button
          title="Volver"
          variant="primary"
          onPress={() => navigation.goBack()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Editar Pregunta</Text>
        <Text style={styles.subtitle}>ID: {questionId}</Text>
      </View>

      {/* Estado de la Pregunta */}
      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Estado:</Text>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.active ? styles.statusActive : styles.statusInactive
            ]}
            onPress={handleToggleActive}
            disabled={saving}
          >
            <Text style={styles.statusText}>
              {formData.active ? 'Activa' : 'Inactiva'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulario */}
      <View style={styles.formContainer}>
        {/* Texto de la Pregunta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Texto de la Pregunta</Text>
          <Input
            placeholder="Ingrese el texto de la pregunta..."
            value={formData.questionText}
            onChangeText={(value) => handleInputChange('questionText', value)}
            variant="outlined"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        {/* Imagen de la Pregunta (Opcional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagen de la Pregunta (Opcional)</Text>
          <Input
            placeholder="URL de la imagen..."
            value={formData.questionImage}
            onChangeText={(value) => handleInputChange('questionImage', value)}
            variant="outlined"
          />
        </View>

        {/* Filtros para Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtrar Categorías</Text>
          <FilterSection
            title="Nivel"
            options={[{ value: '', label: 'Todos los niveles' }, ...levelOptions]}
            selectedValue={selectedLevel}
            onValueChange={(value) => setSelectedLevel(value as LevelCategoryQuestion | '')}
          />

          <FilterSection
            title="Tipo"
            options={[{ value: '', label: 'Todos los tipos' }, ...typeOptions]}
            selectedValue={selectedType}
            onValueChange={(value) => setSelectedType(value as TypeQuestionCategory | '')}
          />
        </View>

        {/* Selección de Categoría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoría</Text>
          {categoryOptions.length > 0 ? (
            <FilterSection
              title=""
              options={categoryOptions}
              selectedValue={formData.categoryId}
              onValueChange={(value) => handleInputChange('categoryId', value)}
            />
          ) : (
            <Text style={styles.noCategoriesText}>
              No hay categorías disponibles con los filtros seleccionados
            </Text>
          )}
        </View>

        {/* Opciones de Respuesta */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Opciones de Respuesta</Text>
            <Text style={styles.optionCount}>
              {formData.options.filter(opt => opt.trim() !== '').length}/6
            </Text>
          </View>

          {formData.options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <Input
                placeholder={`Opción ${index + 1}`}
                value={option}
                onChangeText={(value) => handleOptionChange(index, value)}
                variant="outlined"
                style={styles.optionInput}
              />
              <View style={styles.optionActions}>
                <TouchableOpacity
                  style={[
                    styles.correctAnswerButton,
                    formData.correctAnswer === option && styles.correctAnswerButtonActive
                  ]}
                  onPress={() => option.trim() && handleSetCorrectAnswer(option)}
                >
                  <Text style={[
                    styles.correctAnswerText,
                    formData.correctAnswer === option && styles.correctAnswerTextActive
                  ]}>
                    ✓
                  </Text>
                </TouchableOpacity>
                {formData.options.length > 2 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveOption(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {formData.options.length < 6 && (
            <Button
              title="+ Agregar Opción"
              variant="outlined"
              size="small"
              onPress={handleAddOption}
              style={styles.addOptionButton}
            />
          )}
        </View>

        {/* Respuesta Correcta */}
        {formData.correctAnswer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Respuesta Correcta Seleccionada</Text>
            <View style={styles.correctAnswerDisplay}>
              <Text style={styles.correctAnswerDisplayText}>{formData.correctAnswer}</Text>
            </View>
          </View>
        )}

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <Button
            title="Eliminar"
            variant="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
          />
          <View style={styles.saveActions}>
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            <Button
              title={saving ? "Guardando..." : "Guardar Cambios"}
              variant="primary"
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#000000ff',
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
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statusContainer: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusInactive: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noCategoriesText: {
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    marginRight: 10,
  },
  optionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  correctAnswerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  correctAnswerButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: 'bold',
  },
  correctAnswerTextActive: {
    color: '#FFFFFF',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addOptionButton: {
    marginTop: 10,
  },
  optionCount: {
    fontSize: 14,
    color: '#666666',
    fontWeight: 'bold',
  },
  correctAnswerDisplay: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  correctAnswerDisplayText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 20,
  },
  deleteButton: {
    marginBottom: 15,
    backgroundColor: '#ffffffff',
  },
  saveActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
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
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
});

export default QuestionDetailScreen;