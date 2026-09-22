import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import CategoryForm, {
  CategoryFormErrors,
  CategoryFormValues,
} from '../../components/CategoryForm';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';

const PAGE_MAX_WIDTH = 640;

export interface CategoryDetailViewProps {
  categoryId: string;
  loading: boolean;
  notFound: boolean;
  isActive: boolean;
  saving: boolean;
  formValues: CategoryFormValues;
  errors: CategoryFormErrors;
  onDescriptionChange: (value: string) => void;
  onLevelChange: (level: Level) => void;
  onTypeChange: (type: TypeQuestionCategory) => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSave: () => void;
  onGoBack: () => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  categoryId,
  loading,
  notFound,
  isActive,
  saving,
  formValues,
  errors,
  onDescriptionChange,
  onLevelChange,
  onTypeChange,
  onToggleActive,
  onDelete,
  onCancel,
  onSave,
  onGoBack,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size={80} />
        <Text style={styles.loadingText}>Cargando categoría...</Text>
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar la categoría</Text>
        <Button title="Volver" variant="primary" onPress={onGoBack} />
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
              title={isActive ? 'Activa' : 'Inactiva'}
              variant={isActive ? 'primary' : 'outlined'}
              size="small"
              onPress={onToggleActive}
              disabled={saving}
              style={styles.statusButton}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <CategoryForm
            values={formValues}
            errors={errors}
            onDescriptionChange={onDescriptionChange}
            onLevelChange={onLevelChange}
            onTypeChange={onTypeChange}
          />

          <View style={styles.actionsContainer}>
            <View style={styles.deleteButtonWrap}>
              <Button title="Eliminar" variant="outlined" onPress={onDelete} />
            </View>
            <View style={styles.saveActions}>
              <View style={styles.actionButton}>
                <Button title="Cancelar" variant="outlined" onPress={onCancel} />
              </View>
              <View style={styles.submitButton}>
                <Button
                  title={saving ? 'Guardando...' : 'Guardar Cambios'}
                  variant="primary"
                  onPress={onSave}
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
