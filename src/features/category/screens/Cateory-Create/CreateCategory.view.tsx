import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Input from '@/shared/components/Input/Input.component';
import { Icon } from '@/shared/components/Icon';
import { MIN_DESCRIPTION_LENGTH } from '../../components/CategoryForm';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import {
  CATEGORY_TYPE_META,
  LEVEL_SUBTITLE,
  getCategoryPaletteColor,
} from '../../constants/categoryMeta';

const PAGE_MAX_WIDTH = 640;
const MAX_DESCRIPTION_LENGTH = 250;

export interface CreateCategoryFormErrors {
  descriptionCategory?: string;
  level?: string;
  type?: string;
}

export interface CreateCategoryViewProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  level: Level | '';
  onLevelChange: (level: Level | '') => void;
  type: TypeQuestionCategory | '';
  onTypeChange: (type: TypeQuestionCategory | '') => void;
  errors: CreateCategoryFormErrors;
  submitting: boolean;
  onSubmit: () => void;
  onClear: () => void;
  onCancel: () => void;
}

export const CreateCategoryView: React.FC<CreateCategoryViewProps> = ({
  description,
  onDescriptionChange,
  level,
  onLevelChange,
  type,
  onTypeChange,
  errors,
  submitting,
  onSubmit,
  onClear,
  onCancel,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const isDescriptionValid = description.trim().length >= MIN_DESCRIPTION_LENGTH;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.page}>
        <View style={styles.breadcrumbRow}>
          <TouchableOpacity style={styles.backLink} onPress={onCancel}>
            <Icon name="ArrowLeftIcon" size="sm" color={theme.color.textSecondary} />
            <Text style={styles.backLinkText}>Categorías</Text>
          </TouchableOpacity>
          <View style={styles.modePill}>
            <View style={styles.modeDot} />
            <Text style={styles.modePillText}>Modo Creación</Text>
          </View>
        </View>

        <View style={styles.headerBlock}>
          <View style={styles.headerIconRow}>
            <View style={styles.headerIconBox}>
              <Icon name="TagIcon" size="md" color={theme.color.onPrimary} />
            </View>
            <Text style={styles.title}>Crear Nueva Categoría</Text>
          </View>
          <Text style={styles.subtitle}>
            Completa los detalles de la categoría para estructurar el plan de aprendizaje de
            LinguaPlay.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Descripción de la Categoría <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.charCounter}>
                {description.length} / {MAX_DESCRIPTION_LENGTH}
              </Text>
            </View>
            <Input
              placeholder="Introduce la descripción de la categoría (ej: Modismos coloquiales del día a día)..."
              value={description}
              onChangeText={onDescriptionChange}
              variant="outlined"
              multiline
              numberOfLines={4}
              maxLength={MAX_DESCRIPTION_LENGTH}
              style={styles.textarea}
            />
            <View style={styles.fieldHelperRow}>
              {isDescriptionValid ? (
                <View style={styles.helperRow}>
                  <Icon name="CheckCircleIcon" size="sm" color={theme.color.success} />
                  <Text style={styles.validText}>Válido</Text>
                </View>
              ) : (
                <View style={styles.helperRow}>
                  <Icon name="InfoIcon" size="sm" color={theme.color.textPlaceholder} />
                  <Text style={styles.helperText}>
                    Mínimo {MIN_DESCRIPTION_LENGTH} caracteres obligatorios
                  </Text>
                </View>
              )}
            </View>
            {errors.descriptionCategory && (
              <Text style={styles.errorText}>{errors.descriptionCategory}</Text>
            )}
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Nivel CEFR <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>
                  {level ? `Nivel ${level}` : 'Ninguno seleccionado'}
                </Text>
              </View>
            </View>
            <View style={styles.levelGrid}>
              {Object.values(Level).map((lvl) => (
                <LevelChip
                  key={lvl}
                  level={lvl}
                  isSelected={level === lvl}
                  onPress={() => onLevelChange(level === lvl ? '' : lvl)}
                />
              ))}
            </View>
            {errors.level && <Text style={styles.errorText}>{errors.level}</Text>}
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>
                Tipo de Pregunta <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>{type || 'Ninguno seleccionado'}</Text>
              </View>
            </View>
            <View style={styles.typeGrid}>
              {Object.values(TypeQuestionCategory).map((t) => (
                <TypeChip
                  key={t}
                  type={t}
                  isSelected={type === t}
                  onPress={() => onTypeChange(type === t ? '' : t)}
                />
              ))}
            </View>
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          <View style={styles.previewWidget}>
            <View style={styles.previewLeft}>
              <View style={styles.previewIconBox}>
                <Icon
                  name={type ? CATEGORY_TYPE_META[type].icon : 'TagIcon'}
                  size="md"
                  color={theme.color.textPrimary}
                />
              </View>
              <View>
                <Text style={styles.previewEyebrow}>Previsualización de Tarjeta</Text>
                <Text style={styles.previewSummary}>
                  {level || '—'} • {type || '—'}
                </Text>
              </View>
            </View>
            <View style={styles.previewStatusPill}>
              <Text style={styles.previewStatusText}>En preparación</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClear}
                disabled={submitting}
              >
                <Icon
                  name="ArrowCounterClockwiseIcon"
                  size="sm"
                  color={theme.color.textSecondary}
                />
                <Text style={styles.secondaryButtonText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onCancel}
                disabled={submitting}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={onSubmit}
              disabled={submitting}
            >
              <Icon name="PlusCircleIcon" size="sm" color={theme.color.onPrimary} />
              <Text style={styles.submitButtonText}>
                {submitting ? 'Creando...' : 'Crear Categoría'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

interface LevelChipProps {
  level: Level;
  isSelected: boolean;
  onPress: () => void;
}

const LevelChip: React.FC<LevelChipProps> = ({ level, isSelected, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createChipStyles(theme), [theme]);
  const dotColor = getCategoryPaletteColor(theme, Object.values(Level), level);

  return (
    <TouchableOpacity
      style={[styles.levelChip, isSelected && styles.chipSelected]}
      onPress={onPress}
    >
      <View
        style={[
          styles.levelDot,
          { backgroundColor: isSelected ? theme.color.onPrimary : dotColor },
        ]}
      />
      <Text style={[styles.levelChipText, isSelected && styles.chipTextSelected]}>{level}</Text>
      <Text style={[styles.levelChipSubtitle, isSelected && styles.chipSubtitleSelected]}>
        {LEVEL_SUBTITLE[level]}
      </Text>
    </TouchableOpacity>
  );
};

interface TypeChipProps {
  type: TypeQuestionCategory;
  isSelected: boolean;
  onPress: () => void;
}

const TypeChip: React.FC<TypeChipProps> = ({ type, isSelected, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createChipStyles(theme), [theme]);
  const meta = CATEGORY_TYPE_META[type];

  return (
    <TouchableOpacity
      style={[styles.typeChip, isSelected && styles.chipSelected]}
      onPress={onPress}
    >
      <View style={[styles.typeIconBox, isSelected && styles.typeIconBoxSelected]}>
        <Icon
          name={meta.icon}
          size="sm"
          color={isSelected ? theme.color.onPrimary : theme.color.textSecondary}
        />
      </View>
      <View style={styles.typeChipTextBlock}>
        <Text style={[styles.typeChipLabel, isSelected && styles.chipTextSelected]}>
          {meta.label}
        </Text>
        <Text style={[styles.typeChipSubtitle, isSelected && styles.chipSubtitleSelected]}>
          {meta.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createChipStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    levelChip: {
      flexGrow: 1,
      flexBasis: '15%',
      minWidth: 80,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surfaceElevated,
      borderBottomWidth: theme.borderWidth.md,
      borderBottomColor: theme.color.border,
    },
    levelDot: {
      width: theme.spacing.xs,
      height: theme.spacing.xs,
      borderRadius: theme.radius.full,
      marginBottom: theme.spacing.xs,
    },
    levelChipText: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    levelChipSubtitle: {
      fontSize: theme.fontSize.sm - 1,
      color: theme.color.textSecondary,
      marginTop: theme.spacing.xs / 2,
    },
    typeChip: {
      flexGrow: 1,
      flexBasis: '30%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surfaceElevated,
      borderBottomWidth: theme.borderWidth.md,
      borderBottomColor: theme.color.border,
    },
    typeIconBox: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.surface,
    },
    typeIconBoxSelected: {
      backgroundColor: theme.color.primaryPressed,
    },
    typeChipTextBlock: {
      flexShrink: 1,
    },
    typeChipLabel: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    typeChipSubtitle: {
      fontSize: theme.fontSize.sm - 1,
      color: theme.color.textSecondary,
    },
    chipSelected: {
      backgroundColor: theme.color.primary,
      borderBottomColor: theme.color.primaryPressed,
    },
    chipTextSelected: {
      color: theme.color.onPrimary,
    },
    chipSubtitleSelected: {
      color: theme.color.onPrimary,
    },
  });

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    breadcrumbRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    backLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    backLinkText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    modePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primarySubtle,
    },
    modeDot: {
      width: theme.spacing.xs,
      height: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
    },
    modePillText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    headerBlock: {
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    headerIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    headerIconBox: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: theme.borderWidth.md,
      borderBottomColor: theme.color.primaryPressed,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    formCard: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
      gap: theme.spacing.lg,
      ...theme.shadow.sm,
    },
    field: {
      gap: theme.spacing.xs,
    },
    fieldLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    fieldLabel: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    required: {
      color: theme.color.primary,
    },
    charCounter: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
    },
    textarea: {
      minHeight: theme.spacing.xl * 3,
      textAlignVertical: 'top',
    },
    fieldHelperRow: {
      flexDirection: 'row',
    },
    helperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
    },
    helperText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    validText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
    },
    errorText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textError,
    },
    selectedBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.color.surfaceElevated,
    },
    selectedBadgeText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    levelGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    previewWidget: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surfaceElevated,
    },
    previewLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    previewIconBox: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.surface,
    },
    previewEyebrow: {
      fontSize: theme.fontSize.sm - 1,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPlaceholder,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    previewSummary: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    previewStatusPill: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.surface,
    },
    previewStatusText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    secondaryActions: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surfaceElevated,
    },
    secondaryButtonText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.primary,
      borderBottomWidth: theme.borderWidth.md,
      borderBottomColor: theme.color.primaryPressed,
    },
    submitButtonDisabled: {
      opacity: theme.opacity.disabled,
    },
    submitButtonText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onPrimary,
    },
  });
