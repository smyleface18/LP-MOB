import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';
import { FilterSection } from '@/shared/components/FilterSection/FilterSection.component';
import CategoryCard from '../components/CategoryCard';
import { useCategories } from '../hooks/useCategories';
import { CategoryQuestion } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const PAGE_MAX_WIDTH = 1400;
const CARD_MIN_WIDTH = 320;

const ManageCategoriesScreen = () => {
  const theme = useTheme();
  const { width, isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const navigation = useNavigation();

  const { categories, loading, error, deleteCategory, toggleCategoryActive, loadCategories } =
    useCategories();

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  const numColumns = useMemo(() => {
    const usableWidth = Math.min(width, PAGE_MAX_WIDTH) - theme.spacing.lg * 2;
    return Math.max(1, Math.floor(usableWidth / CARD_MIN_WIDTH));
  }, [width, theme.spacing.lg]);

  const activeFiltersCount = [selectedLevel !== 'all', selectedType !== 'all'].filter(
    Boolean,
  ).length;

  const filteredCategories = categories.filter((category) => {
    const search = searchText.trim().toLowerCase();
    const matchesSearch = !search || category.descriptionCategory.toLowerCase().includes(search);
    const matchesLevel = selectedLevel === 'all' || category.level === selectedLevel;
    const matchesType = selectedType === 'all' || category.type === selectedType;
    return matchesSearch && matchesLevel && matchesType;
  });

  const levelOptions = Object.values(Level).map((l) => ({ value: l, label: l }));
  const typeOptions = Object.values(TypeQuestionCategory).map((t) => ({ value: t, label: t }));

  const handleCategoryPress = (category: CategoryQuestion) => {
    navigation.navigate({
      name: 'CategoryDetail',
      params: { categoryId: category.id, category },
    } as never);
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const response = await deleteCategory(categoryId);
          if (!response?.ok) {
            Alert.alert('Error', 'Failed to delete category');
          }
        },
      },
    ]);
  };

  const handleToggleActive = async (categoryId: string) => {
    const response = await toggleCategoryActive(categoryId);
    if (response && !response.ok) {
      Alert.alert('Error', 'Failed to update category');
    }
  };

  const handleClearFilters = () => {
    setSelectedLevel('all');
    setSelectedType('all');
  };

  const renderCategoryItem = ({ item }: { item: CategoryQuestion }) => (
    <View style={styles.gridItem}>
      <CategoryCard
        category={item}
        onDelete={handleDeleteCategory}
        onToggleActive={handleToggleActive}
        onPress={handleCategoryPress}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.color.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error loading categories</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Button title="Retry" variant="primary" onPress={loadCategories} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Category Management</Text>
          <Text style={styles.subtitle}>Total: {filteredCategories.length} categories</Text>
        </View>

        <View style={styles.toolbar}>
          <View style={styles.searchInput}>
            <Input
              placeholder="Search categories..."
              value={searchText}
              onChangeText={setSearchText}
              variant="outlined"
            />
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
              title="+ Create New Category"
              variant="primary"
              size="medium"
              onPress={() => navigation.navigate('CreateCategory' as never)}
            />
          </View>
        </View>

        {filtersVisible && (
          <View style={styles.filtersPanel}>
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

        {filteredCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
            <Text style={styles.emptySubtext}>
              {searchText || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'No categories available'}
            </Text>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadCategories}
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
    categoriesContent: {
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

export default ManageCategoriesScreen;
