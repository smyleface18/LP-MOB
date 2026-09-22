import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MIN_DESCRIPTION_LENGTH } from '../../components/CategoryForm';
import { categoryService } from '../../services/category.service';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import { CreateCategoryView, CreateCategoryFormErrors } from './CreateCategory.view';

const CreateCategoryScreen = () => {
  const navigation = useNavigation();

  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<Level | ''>('');
  const [type, setType] = useState<TypeQuestionCategory | ''>('');
  const [errors, setErrors] = useState<CreateCategoryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: CreateCategoryFormErrors = {};
    if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      newErrors.descriptionCategory = `Mínimo ${MIN_DESCRIPTION_LENGTH} caracteres`;
    }
    if (!level) newErrors.level = 'Selecciona un nivel CEFR';
    if (!type) newErrors.type = 'Selecciona un tipo de pregunta';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearForm = () => {
    setDescription('');
    setLevel('');
    setType('');
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm() || !level || !type) return;

    setSubmitting(true);
    const response = await categoryService.create({
      descriptionCategory: description.trim(),
      level,
      type,
    });
    setSubmitting(false);

    if (!response.ok) {
      Alert.alert('Error', getErrorMessage(response.message, 'No se pudo crear la categoría'));
      return;
    }

    Alert.alert('Categoría creada', 'Se guardó con éxito en el catálogo', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <CreateCategoryView
      description={description}
      onDescriptionChange={setDescription}
      level={level}
      onLevelChange={setLevel}
      type={type}
      onTypeChange={setType}
      errors={errors}
      submitting={submitting}
      onSubmit={handleSubmit}
      onClear={handleClearForm}
      onCancel={() => navigation.goBack()}
    />
  );
};

export default CreateCategoryScreen;
