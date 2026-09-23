import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppAlert } from '@/app/providers/alert.provider';
import { useCategories } from '../../hooks/useCategories';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import { ManageCategoriesView } from './ManageCategories.view';

const ManageCategoriesScreen = () => {
  const navigation = useNavigation();
  const appAlert = useAppAlert();
  const { categories, loading, error, deleteCategory, toggleCategoryActive, loadCategories } =
    useCategories();

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TypeQuestionCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  const toggleLevel = (level: Level) =>
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );

  const toggleType = (type: TypeQuestionCategory) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const filteredCategories = categories.filter((category) => {
    const search = searchText.trim().toLowerCase();
    const matchesSearch = !search || category.descriptionCategory.toLowerCase().includes(search);
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(category.level);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(category.type);
    return matchesSearch && matchesLevel && matchesType;
  });

  const handleCategoryPress = (category: CategoryQuestion) => {
    navigation.navigate({
      name: 'CategoryDetail',
      params: { categoryId: category.id, category },
    } as never);
  };

  const handleDeleteCategory = (categoryId: string) => {
    appAlert('Eliminar categoría', '¿Estás seguro de que quieres eliminar esta categoría?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const response = await deleteCategory(categoryId);
          if (!response?.ok) {
            appAlert('Error', 'No se pudo eliminar la categoría');
          }
        },
      },
    ]);
  };

  const handleToggleActive = async (categoryId: string) => {
    const response = await toggleCategoryActive(categoryId);
    if (response && !response.ok) {
      appAlert('Error', 'No se pudo actualizar la categoría');
    }
  };

  const handleClearFilters = () => {
    setSelectedLevels([]);
    setSelectedTypes([]);
    setSearchText('');
  };

  return (
    <ManageCategoriesView
      categories={filteredCategories}
      loading={loading}
      error={error}
      searchText={searchText}
      onSearchChange={setSearchText}
      filtersVisible={filtersVisible}
      onToggleFilters={() => setFiltersVisible((prev) => !prev)}
      selectedLevels={selectedLevels}
      onToggleLevel={toggleLevel}
      selectedTypes={selectedTypes}
      onToggleType={toggleType}
      onClearFilters={handleClearFilters}
      onCreatePress={() => navigation.navigate('CreateCategory' as never)}
      onCategoryPress={handleCategoryPress}
      onDeleteCategory={handleDeleteCategory}
      onToggleActive={handleToggleActive}
      onRetry={loadCategories}
    />
  );
};

export default ManageCategoriesScreen;
