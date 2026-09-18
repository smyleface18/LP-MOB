import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import CategoryForm, {
  CategoryFormErrors,
  CategoryFormValues,
  MIN_DESCRIPTION_LENGTH,
} from '../components/CategoryForm';
import { categoryService } from '../services/category.service';
import { getErrorMessage } from '@/shared/api/getErrorMessage';

const EMPTY_FORM: CategoryFormValues = {
  descriptionCategory: '',
  level: '',
  type: '',
};

const PAGE_MAX_WIDTH = 640;

const CreateCategoryScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const [formValues, setFormValues] = useState<CategoryFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: CategoryFormErrors = {};
    const description = formValues.descriptionCategory.trim();

    if (!description) {
      newErrors.descriptionCategory = 'Description is required';
    } else if (description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.descriptionCategory = `Min ${MIN_DESCRIPTION_LENGTH} characters`;
    }
    if (!formValues.level) newErrors.level = 'Level is required';
    if (!formValues.type) newErrors.type = 'Type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearForm = () => {
    setFormValues(EMPTY_FORM);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm() || !formValues.level || !formValues.type) return;

    setSubmitting(true);
    const response = await categoryService.create({
      descriptionCategory: formValues.descriptionCategory.trim(),
      level: formValues.level,
      type: formValues.type,
    });
    setSubmitting(false);

    if (!response.ok) {
      Alert.alert('Error', getErrorMessage(response.message, 'Failed to create category'));
      return;
    }

    Alert.alert('Success', 'Category created successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Category</Text>
          <Text style={styles.subtitle}>Complete the category details</Text>
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
            <View style={styles.actionButton}>
              <Button
                title="Clear"
                variant="outlined"
                size="medium"
                onPress={handleClearForm}
                disabled={submitting}
              />
            </View>
            <View style={styles.actionButton}>
              <Button
                title="Cancel"
                variant="outlined"
                size="medium"
                onPress={() => navigation.goBack()}
                disabled={submitting}
              />
            </View>
            <View style={styles.submitButton}>
              <Button
                title={submitting ? 'Creating...' : 'Create Category'}
                variant="primary"
                size="medium"
                onPress={handleSubmit}
                disabled={submitting}
              />
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
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    formContainer: {
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 120,
    },
    submitButton: {
      width: 180,
    },
  });

export default CreateCategoryScreen;
