import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';
import { FilterSection } from '@/shared/components/FilterSection/FilterSection.component';
import QuestionCard from '../components/QuestionCard';
import { useQuestions } from '../hooks/useQuestion';
import { useCategories } from '@/features/category/hooks/useCategories';
import { Question } from '../types';
import { Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const PAGE_MAX_WIDTH = 1400;
const CARD_MIN_WIDTH = 320;

const ManageQuestionsScreen = () => {
  const theme = useTheme();
  const { width, isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const navigation = useNavigation();

  const { questions, loading, error, deleteQuestion, updateQuestion, loadQuestions } =
    useQuestions();
  const { categories, loading: categoriesLoading } = useCategories();

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // El resultado de crear/editar se guarda desde otra screen — refrescamos
  // la lista cada vez que esta pantalla vuelve a estar en foco.
  useFocusEffect(
    useCallback(() => {
      loadQuestions();
    }, [loadQuestions]),
  );

  const numColumns = useMemo(() => {
    const usableWidth = Math.min(width, PAGE_MAX_WIDTH) - theme.spacing.lg * 2;
    return Math.max(1, Math.floor(usableWidth / CARD_MIN_WIDTH));
  }, [width, theme.spacing.lg]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    selectedType !== 'all',
  ].filter(Boolean).length;

  const filteredQuestions = questions.filter((question) => {
    const matchesCategory = selectedCategory === 'all' || question.categoryId === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || question.category?.level === selectedLevel;
    const matchesType = selectedType === 'all' || question.category?.type === selectedType;
    const search = searchText.trim().toLowerCase();
    const matchesSearch =
      !search ||
      question.content.value.toLowerCase().includes(search) ||
      (question.moreInfo ?? '').toLowerCase().includes(search);

    return matchesCategory && matchesLevel && matchesType && matchesSearch;
  });

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.descriptionCategory,
  }));
  const levelOptions = Object.values(Level).map((level) => ({ value: level, label: level }));
  const typeOptions = Object.values(TypeQuestionCategory).map((type) => ({
    value: type,
    label: type,
  }));

  const handleQuestionPress = (question: Question) => {
    navigation.navigate({
      name: 'QuestionDetail',
      params: { questionId: question.id, question },
    } as never);
  };

  const handleDeleteQuestion = (questionId: string) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const response = await deleteQuestion(questionId);
          if (!response?.ok) {
            Alert.alert('Error', 'Failed to delete question');
          }
        },
      },
    ]);
  };

  const handleToggleActive = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const response = await updateQuestion(questionId, { active: !question.active });
    if (!response?.ok) {
      Alert.alert('Error', 'Failed to update question');
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedType('all');
  };

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <View style={styles.gridItem}>
      <QuestionCard
        question={item}
        onDelete={handleDeleteQuestion}
        onToggleActive={handleToggleActive}
        onPress={handleQuestionPress}
      />
    </View>
  );

  if (loading || categoriesLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.color.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error loading questions</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Button title="Retry" variant="primary" onPress={loadQuestions} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Question Management</Text>
          <Text style={styles.subtitle}>Total: {filteredQuestions.length} questions</Text>
        </View>

        <View style={styles.toolbar}>
          <View style={styles.searchInput}>
            <Input placeholder="Search questions..." value={searchText} onChangeText={setSearchText} variant="outlined" />
          </View>
          <View style={styles.toolbarButton}>
            <Button
              title={`Filters${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}`}
              variant={filtersVisible ? 'primary' : 'outlined'}
              size="medium"
              onPress={() => setFiltersVisible((prev) => !prev)}
            />
          </View>
          <View style={styles.toolbarButton}>
            <Button
              title="+ Create New Question"
              variant="primary"
              size="medium"
              onPress={() => navigation.navigate('CreateQuestionScreen' as never)}
            />
          </View>
        </View>

        {filtersVisible && (
          <View style={styles.filtersPanel}>
            <FilterSection
              title="Categories"
              options={categoryOptions}
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
            />
            <FilterSection
              title="Levels"
              options={levelOptions}
              selectedValue={selectedLevel}
              onValueChange={setSelectedLevel}
            />
            <FilterSection
              title="Types"
              options={typeOptions}
              selectedValue={selectedType}
              onValueChange={setSelectedType}
            />
            {activeFiltersCount > 0 && (
              <Button title="Clear Filters" variant="outlined" size="small" onPress={handleClearFilters} />
            )}
          </View>
        )}

        {filteredQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No questions found</Text>
            <Text style={styles.emptySubtext}>
              {searchText || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'No questions available'}
            </Text>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={filteredQuestions}
            renderItem={renderQuestionItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
            contentContainerStyle={styles.questionsContent}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadQuestions}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
      alignItems: 'center',
    },
    page: {
      flex: 1,
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
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    toolbar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      minWidth: 200,
    },
    toolbarButton: {
      minWidth: 160,
    },
    filtersPanel: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      gap: theme.spacing.sm,
    },
    questionsContent: {
      padding: theme.spacing.lg,
      flexGrow: 1,
    },
    gridRow: {
      gap: theme.spacing.md,
    },
    gridItem: {
      flex: 1,
      marginBottom: theme.spacing.md,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.background,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    loadingText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    errorTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
      textAlign: 'center',
    },
    errorSubtext: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    emptySubtext: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
  });

export default ManageQuestionsScreen;
