import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import QuestionForm, {
  LevelFilter,
  QuestionFormValues,
  TypeFilter,
} from '../components/QuestionForm';
import { useCategories } from '@/features/category/hooks/useCategories';
import { questionService } from '../services/question.service';
import { questionOptionsService } from '../services/question-options.service';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { ContentType } from '@/shared/types/common';

const EMPTY_FORM: QuestionFormValues = {
  content: { type: ContentType.TEXT, value: '' },
  moreInfo: '',
  timeLimit: 15,
  categoryId: '',
  options: [
    { content: { type: ContentType.TEXT, value: '' }, isCorrect: false },
    { content: { type: ContentType.TEXT, value: '' }, isCorrect: false },
  ],
};

const PAGE_MAX_WIDTH = 1100;

const CreateQuestionScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const { categories, loading: categoriesLoading } = useCategories();

  const [formValues, setFormValues] = useState<QuestionFormValues>(EMPTY_FORM);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [selectedType, setSelectedType] = useState<TypeFilter>('all');
  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = () => {
    setFormValues((prev) =>
      prev.options.length < 6
        ? {
            ...prev,
            options: [...prev.options, { content: { type: ContentType.TEXT, value: '' }, isCorrect: false }],
          }
        : prev,
    );
  };

  const handleRemoveOption = (index: number) => {
    setFormValues((prev) =>
      prev.options.length <= 2
        ? prev
        : { ...prev, options: prev.options.filter((_, i) => i !== index) },
    );
  };

  const handleClearForm = () => {
    setFormValues(EMPTY_FORM);
    setSelectedLevel('all');
    setSelectedType('all');
  };

  const validateForm = (): boolean => {
    if (!formValues.content.value.trim()) {
      Alert.alert('Error', 'You must provide the question content');
      return false;
    }
    const filledOptions = formValues.options.filter((opt) => opt.content.value.trim() !== '');
    if (filledOptions.length < 2) {
      Alert.alert('Error', 'You must provide at least 2 options');
      return false;
    }
    if (!formValues.options.some((opt) => opt.isCorrect)) {
      Alert.alert('Error', 'You must mark one option as the correct answer');
      return false;
    }
    if (!formValues.categoryId) {
      Alert.alert('Error', 'You must select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    const questionResponse = await questionService.create({
      content: formValues.content,
      moreInfo: formValues.moreInfo || undefined,
      categoryId: formValues.categoryId,
      timeLimit: formValues.timeLimit,
    });

    if (!questionResponse.ok || !questionResponse.data) {
      setSubmitting(false);
      Alert.alert('Error', getErrorMessage(questionResponse.message, 'Failed to create question'));
      return;
    }

    const questionId = questionResponse.data.id;
    const optionsResponse = await questionOptionsService.createMany(
      formValues.options
        .filter((opt) => opt.content.value.trim() !== '')
        .map((opt) => ({ content: opt.content, isCorrect: opt.isCorrect, questionId })),
    );
    setSubmitting(false);

    if (!optionsResponse.ok) {
      Alert.alert(
        'Question created, but options failed',
        `${getErrorMessage(optionsResponse.message, 'Failed to create options')}\n\nYou can add them from the question detail screen.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
      return;
    }

    Alert.alert('Success', 'Question created successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size={80} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Question</Text>
          <Text style={styles.subtitle}>Complete the question details</Text>
        </View>

        <View style={styles.formContainer}>
          <QuestionForm
            values={formValues}
            categories={categories}
            selectedLevel={selectedLevel}
            selectedType={selectedType}
            onLevelFilterChange={setSelectedLevel}
            onTypeFilterChange={setSelectedType}
            onContentChange={(content) => setFormValues((prev) => ({ ...prev, content }))}
            onMoreInfoChange={(moreInfo) => setFormValues((prev) => ({ ...prev, moreInfo }))}
            onTimeLimitChange={(timeLimit) => setFormValues((prev) => ({ ...prev, timeLimit }))}
            onCategoryChange={(categoryId) => setFormValues((prev) => ({ ...prev, categoryId }))}
            onOptionContentChange={(index, content) =>
              setFormValues((prev) => ({
                ...prev,
                options: prev.options.map((opt, i) => (i === index ? { ...opt, content } : opt)),
              }))
            }
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onSetCorrectOption={(index) =>
              setFormValues((prev) => ({
                ...prev,
                options: prev.options.map((opt, i) => ({ ...opt, isCorrect: i === index })),
              }))
            }
          />

          <View style={styles.actionsContainer}>
            <View style={styles.actionButton}>
              <Button title="Clear" variant="outlined" size="medium" onPress={handleClearForm} />
            </View>
            <View style={styles.actionButton}>
              <Button
                title="Cancel"
                variant="outlined"
                size="medium"
                onPress={() => navigation.goBack()}
              />
            </View>
            <View style={styles.submitButton}>
              <Button
                title={submitting ? 'Creating...' : 'Create Question'}
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
      marginTop: theme.spacing.lg,
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
    },
    loadingText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
  });

export default CreateQuestionScreen;
