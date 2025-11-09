import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LevelCategoryQuestion, TypeQuestionCategory, CategoryQuestion } from '../types/type';
import Button from '../components/Button.component';
import Input from '../components/Input.component';
import FilterSection from '../components/FilterSection.component';
import { useCategories } from '../hooks/useCategories';
import { questionService } from '../services/questionService';

const CreateQuestionScreen = () => {
  const navigation = useNavigation();
  const { categories, loading: categoriesLoading } = useCategories();

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
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

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
    setShowOptionsModal(false);
  };

  const validateForm = () => {
    if (!formData.questionText && !formData.questionImage) {
      Alert.alert('Error', 'Debe proporcionar texto de pregunta o imagen');
      return false;
    }

    if (formData.options.filter(opt => opt.trim() !== '').length < 2) {
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        options: formData.options.filter(opt => opt.trim() !== '')
      };

      await questionService.create(submitData);
      Alert.alert('Éxito', 'Pregunta creada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la pregunta');
      console.error('Error creating question:', error);
    }
  };

  if (categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Crear Nueva Pregunta</Text>
        <Text style={styles.subtitle}>Complete los datos de la pregunta</Text>
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
          <Text style={styles.sectionTitle}>Seleccionar Categoría</Text>
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
              <Text style={styles.correctAnswerText}>{formData.correctAnswer}</Text>
            </View>
          </View>
        )}

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <Button
            title="Cancelar"
            variant="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
          <Button
            title="Crear Pregunta"
            variant="primary"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
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
  correctAnswerText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default CreateQuestionScreen;