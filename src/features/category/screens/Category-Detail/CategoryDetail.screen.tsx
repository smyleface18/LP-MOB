import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CategoryFormErrors,
  CategoryFormValues,
  MIN_DESCRIPTION_LENGTH,
} from '../../components/CategoryForm';
import { categoryService } from '../../services/category.service';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { CategoryQuestion } from '@/shared/types/category-question';
import { CategoryDetailView } from './CategoryDetail.view';

interface RouteParams {
  categoryId: string;
  category?: CategoryQuestion;
}

const toFormValues = (category: CategoryQuestion): CategoryFormValues => ({
  descriptionCategory: category.descriptionCategory,
  level: category.level,
  type: category.type,
});

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, category: initialCategory } = route.params as RouteParams;

  const [loading, setLoading] = useState(!initialCategory);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<CategoryQuestion | null>(initialCategory ?? null);
  const [formValues, setFormValues] = useState<CategoryFormValues>(
    initialCategory
      ? toFormValues(initialCategory)
      : { descriptionCategory: '', level: '', type: '' },
  );
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  useEffect(() => {
    if (initialCategory || !categoryId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      const response = await categoryService.getById(categoryId);
      if (cancelled) return;

      if (!response.ok || !response.data) {
        Alert.alert('Error', getErrorMessage(response.message, 'No se pudo cargar la categoría'));
        setLoading(false);
        return;
      }

      setCategory(response.data);
      setFormValues(toFormValues(response.data));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId, initialCategory]);

  const validateForm = (): boolean => {
    const newErrors: CategoryFormErrors = {};
    const description = formValues.descriptionCategory.trim();

    if (!description) {
      newErrors.descriptionCategory = 'Descripción requerida';
    } else if (description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.descriptionCategory = `Mínimo ${MIN_DESCRIPTION_LENGTH} caracteres`;
    }
    if (!formValues.level) newErrors.level = 'Nivel requerido';
    if (!formValues.type) newErrors.type = 'Tipo requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !formValues.level || !formValues.type) return;

    setSaving(true);
    const response = await categoryService.update(categoryId, {
      descriptionCategory: formValues.descriptionCategory.trim(),
      level: formValues.level,
      type: formValues.type,
    });
    setSaving(false);

    if (!response.ok) {
      Alert.alert('Error', getErrorMessage(response.message, 'No se pudo actualizar la categoría'));
      return;
    }

    Alert.alert('Éxito', 'Categoría actualizada correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Categoría', '¿Estás seguro de que quieres eliminar esta categoría?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const response = await categoryService.delete(categoryId);
          if (!response.ok) {
            Alert.alert(
              'Error',
              getErrorMessage(response.message, 'No se pudo eliminar la categoría'),
            );
            return;
          }
          Alert.alert('Éxito', 'Categoría eliminada correctamente', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  };

  const handleToggleActive = async () => {
    if (!category) return;

    setSaving(true);
    const response = await categoryService.update(categoryId, { active: !category.active });
    setSaving(false);

    if (!response.ok) {
      Alert.alert('Error', getErrorMessage(response.message, 'No se pudo actualizar el estado'));
      return;
    }

    setCategory((prev) => (prev ? { ...prev, active: !prev.active } : prev));
  };

  return (
    <CategoryDetailView
      categoryId={categoryId}
      loading={loading}
      notFound={!loading && !category}
      isActive={category?.active ?? false}
      saving={saving}
      formValues={formValues}
      errors={errors}
      onDescriptionChange={(descriptionCategory) =>
        setFormValues((prev) => ({ ...prev, descriptionCategory }))
      }
      onLevelChange={(level) => setFormValues((prev) => ({ ...prev, level }))}
      onTypeChange={(type) => setFormValues((prev) => ({ ...prev, type }))}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      onCancel={() => navigation.goBack()}
      onSave={handleSave}
      onGoBack={() => navigation.goBack()}
    />
  );
};

export default CategoryDetailScreen;
