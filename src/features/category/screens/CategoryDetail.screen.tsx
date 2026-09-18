import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import CategoryForm, { CategoryFormErrors, CategoryFormValues, MIN_DESCRIPTION_LENGTH } from '../components/CategoryForm';
import { categoryService } from '../services/category.service';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { CategoryQuestion } from '@/shared/types/category-question';

interface RouteParams {
  categoryId: string;
  category?: CategoryQuestion;
}

const PAGE_MAX_WIDTH = 640;

const toFormValues = (category: CategoryQuestion): CategoryFormValues => ({
  descriptionCategory: category.descriptionCategory,
  level: category.level,
  type: category.type,
});

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, category: initialCategory } = route.params as RouteParams;

  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const [loading, setLoading] = useState(!initialCategory);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<CategoryQuestion | null>(initialCategory ?? null);
  const [formValues, setFormValues] = useState<CategoryFormValues>(
    initialCategory ? toFormValues(initialCategory) : { descriptionCategory: '', level: '', type: '' },
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
            Alert.alert('Error', getErrorMessage(response.message, 'No se pudo eliminar la categoría'));
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.color.primary} />
        <Text style={styles.loadingText}>Cargando categoría...</Text>
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar la categoría</Text>
        <Button title="Volver" variant="primary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Editar Categoría</Text>
              <Text style={styles.subtitle}>ID: {categoryId}</Text>
            </View>
            <Button
              title={category.active ? 'Activa' : 'Inactiva'}
              variant={category.active ? 'primary' : 'outlined'}
              size="small"
              onPress={handleToggleActive}
              disabled={saving}
              style={styles.statusButton}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <CategoryForm
            values={formValues}
            errors={errors}
            onDescriptionChange={(descriptionCategory) =>
              setFormValues((prev) => ({ ...prev, descriptionCategory }))
            }
            onLevelChange={(level) => setFormValues((prev) => ({ ...prev, level }))}
            onTypeChange={(type) => setFormValues((prev) => ({ ...prev, type }))}
          />

          <View style={styles.actionsContainer}>
            <View style={styles.deleteButtonWrap}>
              <Button title="Eliminar" variant="outlined" onPress={handleDelete} />
            </View>
            <View style={styles.saveActions}>
              <View style={styles.actionButton}>
                <Button title="Cancelar" variant="outlined" onPress={() => navigation.goBack()} />
              </View>
              <View style={styles.submitButton}>
                <Button
                  title={saving ? 'Guardando...' : 'Guardar Cambios'}
                  variant="primary"
                  onPress={handleSave}
                  disabled={saving}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      paddingBottom: theme.spacing.xl,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    header: {
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
      backgroundColor: theme.color.surfaceElevated,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    statusButton: {
      width: 120,
    },
    formContainer: {
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
    },
    actionsContainer: {
      marginTop: theme.spacing.lg,
      flexDirection: isDesktop ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: isDesktop ? 'center' : 'stretch',
      gap: theme.spacing.md,
    },
    deleteButtonWrap: {
      width: 140,
    },
    saveActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 140,
    },
    submitButton: {
      width: 200,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.background,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    loadingText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    errorText: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
  });

export default CategoryDetailScreen;
