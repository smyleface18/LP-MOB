import React, { useCallback, useMemo, useState } from 'react';
import { RefreshButton } from '@/shared/components/RefreshButton';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useAppAlert } from '@/app/providers/alert.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import { FilterToolbar, FilterGroup } from '@/shared/components/FilterToolbar';
import {
  CATEGORY_TYPE_META,
  getCategoryPaletteColor,
} from '@/features/category/constants/categoryMeta';
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
  const appAlert = useAppAlert();

  const { questions, loading, error, deleteQuestion, loadQuestions } = useQuestions();
  const { categories, loading: categoriesLoading, loadCategories } = useCategories();

  // Refresca preguntas y categorías (los filtros dependen de ambas).
  const refreshAll = useCallback(() => {
    void loadQuestions();
    void loadCategories();
  }, [loadQuestions, loadCategories]);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TypeQuestionCategory[]>([]);

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

  const activeFiltersCount =
    selectedCategories.length + selectedLevels.length + selectedTypes.length;

  // Dentro de cada grupo la selección es "cualquiera de" (OR); entre grupos, AND.
  const filteredQuestions = questions.filter((question) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(question.categoryId);
    const matchesLevel =
      selectedLevels.length === 0 ||
      (!!question.category && selectedLevels.includes(question.category.level));
    const matchesType =
      selectedTypes.length === 0 ||
      (!!question.category && selectedTypes.includes(question.category.type));
    const search = searchText.trim().toLowerCase();
    const matchesSearch =
      !search ||
      (question.text ?? '').toLowerCase().includes(search) ||
      (question.moreInfo ?? '').toLowerCase().includes(search);

    return matchesCategory && matchesLevel && matchesType && matchesSearch;
  });

  const toggle =
    <T,>(value: T) =>
    (prev: T[]) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];

  const filterGroups: FilterGroup[] = [
    {
      key: 'category',
      title: 'Categoría',
      hint: 'Selecciona una o más',
      options: categories.map((category) => ({
        value: category.id,
        label: category.descriptionCategory,
      })),
      selected: selectedCategories,
      onToggle: (value) => setSelectedCategories(toggle(value)),
    },
    {
      key: 'level',
      title: 'Nivel MCER (CEFR)',
      hint: 'Selecciona uno o más',
      options: Object.values(Level).map((level) => ({ value: level, label: level })),
      selected: selectedLevels,
      onToggle: (value) => setSelectedLevels(toggle(value as Level)),
    },
    {
      key: 'type',
      title: 'Tipo de Habilidad',
      hint: 'Macrodestrezas lingüísticas',
      options: Object.values(TypeQuestionCategory).map((type) => ({
        value: type,
        label: CATEGORY_TYPE_META[type].label,
        icon: CATEGORY_TYPE_META[type].icon,
        iconColor: getCategoryPaletteColor(theme, Object.values(TypeQuestionCategory), type),
      })),
      selected: selectedTypes,
      onToggle: (value) => setSelectedTypes(toggle(value as TypeQuestionCategory)),
    },
  ];

  const handleQuestionPress = (question: Question) => {
    navigation.navigate({
      name: 'QuestionDetail',
      params: { questionId: question.id, question },
    } as never);
  };

  const handleDeleteQuestion = (questionId: string) => {
    appAlert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const response = await deleteQuestion(questionId);
          if (!response?.ok) {
            appAlert('Error', 'Failed to delete question');
          }
        },
      },
    ]);
  };

  // Igual que en categorías: "Limpiar" también borra la búsqueda.
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedTypes([]);
    setSearchText('');
  };

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <View style={styles.gridItem}>
      <QuestionCard question={item} onDelete={handleDeleteQuestion} onPress={handleQuestionPress} />
    </View>
  );

  if (loading || categoriesLoading) {
    return (
      <View style={styles.centerContainer}>
        <Loading size={80} />
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
        <View style={[styles.header, styles.headerRow]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Question Management</Text>
            <Text style={styles.subtitle}>Total: {filteredQuestions.length} questions</Text>
          </View>
          <RefreshButton
            onPress={refreshAll}
            refreshing={loading}
            accessibilityLabel="Actualizar preguntas"
          />
          <Button
            title="+ Create New Question"
            variant="primary"
            size="medium"
            onPress={() => navigation.navigate('CreateQuestion' as never)}
          />
        </View>

        <View style={styles.toolbarWrap}>
          <FilterToolbar
            searchText={searchText}
            onSearchChange={setSearchText}
            searchPlaceholder="Buscar preguntas por enunciado o info..."
            filtersVisible={filtersVisible}
            onToggleFilters={() => setFiltersVisible((prev) => !prev)}
            onClearFilters={handleClearFilters}
            groups={filterGroups}
          />
        </View>

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
            onRefresh={refreshAll}
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
    headerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerText: {
      flex: 1,
      minWidth: 200,
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
    toolbarWrap: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
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
