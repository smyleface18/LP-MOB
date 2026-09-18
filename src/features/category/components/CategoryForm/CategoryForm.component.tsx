import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Input from '@/shared/components/Input/Input.component';
import { FilterSection } from '@/shared/components/FilterSection/FilterSection.component';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';

export interface CategoryFormValues {
  descriptionCategory: string;
  level: Level | '';
  type: TypeQuestionCategory | '';
}

export interface CategoryFormErrors {
  descriptionCategory?: string;
  level?: string;
  type?: string;
}

export interface CategoryFormProps {
  values: CategoryFormValues;
  errors?: CategoryFormErrors;
  onDescriptionChange: (value: string) => void;
  onLevelChange: (level: Level) => void;
  onTypeChange: (type: TypeQuestionCategory) => void;
}

export const MIN_DESCRIPTION_LENGTH = 10;

const CategoryForm: React.FC<CategoryFormProps> = ({
  values,
  errors,
  onDescriptionChange,
  onLevelChange,
  onTypeChange,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const levelOptions = Object.values(Level).map((level) => ({ value: level, label: level }));
  const typeOptions = Object.values(TypeQuestionCategory).map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Description *</Text>
        <Input
          placeholder="Enter the category description..."
          value={values.descriptionCategory}
          onChangeText={onDescriptionChange}
          variant="outlined"
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
        {errors?.descriptionCategory ? (
          <Text style={styles.errorText}>{errors.descriptionCategory}</Text>
        ) : (
          <Text style={styles.helperText}>Minimum {MIN_DESCRIPTION_LENGTH} characters.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Level *</Text>
        <FilterSection
          title=""
          options={levelOptions}
          selectedValue={values.level}
          onValueChange={(value) => onLevelChange(value as Level)}
          showAllOption={false}
        />
        {errors?.level && <Text style={styles.errorText}>{errors.level}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type *</Text>
        <FilterSection
          title=""
          options={typeOptions}
          selectedValue={values.type}
          onValueChange={(value) => onTypeChange(value as TypeQuestionCategory)}
          showAllOption={false}
        />
        {errors?.type && <Text style={styles.errorText}>{errors.type}</Text>}
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    errorText: {
      color: theme.color.textError,
      fontSize: theme.fontSize.sm,
      marginTop: theme.spacing.xs,
      fontFamily: theme.fontFamily.bodyBold,
    },
    helperText: {
      color: theme.color.textSecondary,
      fontSize: theme.fontSize.sm,
      marginTop: theme.spacing.xs,
      fontStyle: 'italic',
    },
  });

export default CategoryForm;
