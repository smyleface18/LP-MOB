import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Input from '@/shared/components/Input/Input.component';
import Button from '@/shared/components/Button/Button.component';
import { FilterSection } from '@/shared/components/FilterSection/FilterSection.component';
import ContentEditor, { ContentEditorValue } from '../ContentEditor';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { ContentType, Level } from '@/shared/types/common';
import { MediaAsset } from '@/shared/types/common/cores.type';

export interface QuestionOptionFormValue {
  /** Presente solo cuando la opción ya existe en el backend (modo edición). */
  id?: string;
  contentType: ContentType;
  /** Solo aplica cuando contentType es TEXT — exclusivo con mediaId. */
  text: string;
  mediaId?: string;
  media?: MediaAsset;
  isCorrect: boolean;
}

export interface QuestionFormValues {
  contentType: ContentType;
  /** El enunciado de la pregunta — siempre obligatorio, sea cual sea el contentType. */
  text: string;
  mediaId?: string;
  media?: MediaAsset;
  moreInfo: string;
  timeLimit: number;
  categoryId: string;
  options: QuestionOptionFormValue[];
}

export type LevelFilter = Level | 'all';
export type TypeFilter = TypeQuestionCategory | 'all';

export interface QuestionFormProps {
  values: QuestionFormValues;
  categories: CategoryQuestion[];
  selectedLevel: LevelFilter;
  selectedType: TypeFilter;
  onLevelFilterChange: (level: LevelFilter) => void;
  onTypeFilterChange: (type: TypeFilter) => void;
  onContentChange: (value: ContentEditorValue) => void;
  onTextChange: (text: string) => void;
  onMoreInfoChange: (moreInfo: string) => void;
  onTimeLimitChange: (timeLimit: number) => void;
  onCategoryChange: (categoryId: string) => void;
  onOptionContentChange: (index: number, value: ContentEditorValue) => void;
  onOptionTextChange: (index: number, text: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSetCorrectOption: (index: number) => void;
}

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

const QuestionForm: React.FC<QuestionFormProps> = ({
  values,
  categories,
  selectedLevel,
  selectedType,
  onLevelFilterChange,
  onTypeFilterChange,
  onContentChange,
  onTextChange,
  onMoreInfoChange,
  onTimeLimitChange,
  onCategoryChange,
  onOptionContentChange,
  onOptionTextChange,
  onAddOption,
  onRemoveOption,
  onSetCorrectOption,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const filteredCategories = categories.filter((category) => {
    const matchesLevel = selectedLevel === 'all' || category.level === selectedLevel;
    const matchesType = selectedType === 'all' || category.type === selectedType;
    return matchesLevel && matchesType;
  });

  const categoryOptions = filteredCategories.map((cat) => ({
    value: cat.id,
    label: cat.descriptionCategory,
  }));
  const levelOptions = Object.values(Level).map((level) => ({ value: level, label: level }));
  const typeOptions = Object.values(TypeQuestionCategory).map((type) => ({
    value: type,
    label: type,
  }));

  const selectedCategory = categories.find((cat) => cat.id === values.categoryId);
  const hasCorrectAnswer = values.options.some((opt) => opt.isCorrect);

  const FieldsColumn = (
    <View style={styles.column}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question Text</Text>
        <Input
          placeholder="e.g. How do you say drink in English? (or, for AUDIO, Which word do you hear?)"
          value={values.text}
          onChangeText={onTextChange}
          variant="outlined"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.section}>
        <ContentEditor
          label="Content Type"
          value={{ contentType: values.contentType, mediaId: values.mediaId, media: values.media }}
          onChange={onContentChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Info (Optional)</Text>
        <Input
          placeholder="Extra context or hint for this question..."
          value={values.moreInfo}
          onChangeText={onMoreInfoChange}
          variant="outlined"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Limit (seconds)</Text>
        <Input
          placeholder="5"
          value={String(values.timeLimit)}
          onChangeText={(text) => {
            const parsed = parseInt(text, 10);
            onTimeLimitChange(Number.isNaN(parsed) ? 0 : parsed);
          }}
          keyboardType="numeric"
          variant="outlined"
          style={styles.timeLimitInput}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Answer Options</Text>
          <Text style={styles.optionCount}>
            {values.options.length}/{MAX_OPTIONS}
          </Text>
        </View>
        {!hasCorrectAnswer && (
          <Text style={styles.warningText}>Mark one option as the correct answer.</Text>
        )}

        {values.options.map((option, index) => (
          <View key={option.id ?? index} style={styles.optionCard}>
            <View style={styles.optionHeader}>
              <TouchableOpacity
                style={[styles.iconButton, option.isCorrect && styles.iconButtonActive]}
                onPress={() => onSetCorrectOption(index)}
              >
                <Text style={[styles.iconButtonText, option.isCorrect && styles.iconButtonTextActive]}>
                  ✓
                </Text>
              </TouchableOpacity>
              <Text style={styles.optionLabel}>
                Option {index + 1}
                {option.isCorrect ? ' (Correct)' : ''}
              </Text>
              {values.options.length > MIN_OPTIONS && (
                <TouchableOpacity
                  style={[styles.iconButton, styles.iconButtonDanger]}
                  onPress={() => onRemoveOption(index)}
                >
                  <Text style={styles.iconButtonDangerText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            <ContentEditor
              value={{
                contentType: option.contentType,
                mediaId: option.mediaId,
                media: option.media,
              }}
              onChange={(value) => onOptionContentChange(index, value)}
            />
            {option.contentType === ContentType.TEXT && (
              <Input
                placeholder="Option text..."
                value={option.text}
                onChangeText={(text) => onOptionTextChange(index, text)}
                variant="outlined"
                style={styles.optionTextInput}
              />
            )}
          </View>
        ))}

        {values.options.length < MAX_OPTIONS && (
          <Button
            title="+ Add Option"
            variant="outlined"
            size="small"
            onPress={onAddOption}
            style={styles.addOptionButton}
          />
        )}
      </View>
    </View>
  );

  const CategoryColumn = (
    <View style={styles.column}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter Categories</Text>
        <FilterSection
          title="Level"
          options={levelOptions}
          selectedValue={selectedLevel}
          onValueChange={(value) => onLevelFilterChange(value as LevelFilter)}
          showAllOption
        />
        <FilterSection
          title="Type"
          options={typeOptions}
          selectedValue={selectedType}
          onValueChange={(value) => onTypeFilterChange(value as TypeFilter)}
          showAllOption
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Category</Text>
        {categoryOptions.length > 0 ? (
          <FilterSection
            title=""
            options={categoryOptions}
            selectedValue={values.categoryId}
            onValueChange={onCategoryChange}
            showAllOption={false}
          />
        ) : (
          <Text style={styles.noCategoriesText}>
            No categories available with the selected filters
          </Text>
        )}
      </View>

      {selectedCategory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Category:</Text>
              <Text style={styles.summaryValue}>
                {selectedCategory.descriptionCategory} ({selectedCategory.level} -{' '}
                {selectedCategory.type})
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Options:</Text>
              <Text style={styles.summaryValue}>{values.options.length}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={isDesktop ? styles.rowLayout : styles.stackLayout}>
      {FieldsColumn}
      {CategoryColumn}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    rowLayout: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.xl,
    },
    stackLayout: {
      flexDirection: 'column',
    },
    column: {
      flex: 1,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    timeLimitInput: {
      maxWidth: 120,
    },
    noCategoriesText: {
      color: theme.color.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    optionCount: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    warningText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.error,
      marginBottom: theme.spacing.sm,
    },
    optionCard: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    optionLabel: {
      flex: 1,
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    iconButton: {
      width: 32,
      height: 32,
      borderRadius: theme.radius.full,
      borderWidth: theme.borderWidth.sm,
      borderColor: theme.color.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButtonActive: {
      borderColor: theme.color.success,
      backgroundColor: theme.color.success,
    },
    iconButtonText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    iconButtonTextActive: {
      color: theme.color.onSuccess,
    },
    iconButtonDanger: {
      backgroundColor: theme.color.error,
      borderColor: theme.color.error,
    },
    iconButtonDangerText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onError,
    },
    addOptionButton: {
      marginTop: theme.spacing.sm,
      alignSelf: 'flex-start',
    },
    optionTextInput: {
      marginTop: theme.spacing.sm,
    },
    summaryContainer: {
      backgroundColor: theme.color.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderLeftWidth: theme.borderWidth.md,
      borderLeftColor: theme.color.primary,
    },
    summaryItem: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    summaryLabel: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      width: 100,
    },
    summaryValue: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      flex: 1,
    },
  });

export default QuestionForm;
