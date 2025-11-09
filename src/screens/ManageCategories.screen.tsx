import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { CategoryQuestion, LevelCategoryQuestion, TypeQuestionCategory } from '../types/type';
import Button from '../components/Button.component';
import CategoryCard from '../components/CategoryCard.component';
import FilterSection from '../components/FilterSection.component';
import Input from '../components/Input.component';
import { useCategories } from '../hooks/useCategories';
import { useNavigation } from '@react-navigation/native';

const ManageCategoriesScreen = () => {
  const { 
    categories, 
    loading, 
    error, 
    updateCategory, 
    deleteCategory,
    loadCategories
  } = useCategories();

  const navigation = useNavigation();

  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Count active filters
  const activeFiltersCount = [
    selectedLevel !== 'all', 
    selectedType !== 'all'
  ].filter(Boolean).length;

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.descriptionCategory.toLowerCase().includes(searchText.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || category.level === selectedLevel;
    const matchesType = selectedType === 'all' || category.type === selectedType;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const handleCreateCategoryRedirect = () => {
    navigation.navigate('CreateCategoryScreen' as never);
  };

  const handleCategoryPress = (category: CategoryQuestion) => {
    navigation.navigate({name :'CreateCategoryScreen', params : {
      categoryId: category.id,
      category: category
    }} as never);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              Alert.alert('Success', 'Category deleted successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete category');
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        await updateCategory(categoryId, { active: !category.active });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update category');
    }
  };

  const handleClearFilters = () => {
    setSelectedLevel('all');
    setSelectedType('all');
    setFiltersModalVisible(false);
  };

  const levelOptions = Object.values(LevelCategoryQuestion).map(level => ({
    value: level,
    label: level
  }));

  const typeOptions = Object.values(TypeQuestionCategory).map(type => ({
    value: type,
    label: type
  }));

  const renderCategoryItem = ({ item }: { item: CategoryQuestion }) => (
    <CategoryCard
      category={item}
      onEdit={handleCategoryPress}
      onDelete={handleDeleteCategory}
      onToggleActive={handleToggleActive}
      onPress={handleCategoryPress}
    />
  );

  // Show loading while data is being loaded
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  // Show error if there's a problem loading data
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading categories</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Button
          title="Retry"
          variant="primary"
          onPress={loadCategories}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Category Management</Text>
        <Text style={styles.subtitle}>
          Total: {filteredCategories.length} categories
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search categories..."
          value={searchText}
          onChangeText={setSearchText}
          variant="outlined"
          style={styles.searchInput}
        />
        
        <TouchableOpacity 
          style={styles.filtersButton}
          onPress={() => setFiltersModalVisible(true)}
        >
          <Text style={styles.filtersButtonText}>
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories found</Text>
          <Text style={styles.emptySubtext}>
            {searchText || selectedLevel !== 'all' || selectedType !== 'all' 
              ? 'Try adjusting your search filters' 
              : 'No categories available'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadCategories}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      )}

      {/* Create Category Button */}
      <View style={styles.createButtonContainer}>
        <Button
          title="+ Create New Category"
          variant="primary"
          size="large"
          onPress={handleCreateCategoryRedirect}
          style={styles.createButton}
        />
      </View>

      {/* Filters Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filtersModalVisible}
        onRequestClose={() => setFiltersModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setFiltersModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersScroll} showsVerticalScrollIndicator={false}>
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
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Clear Filters"
                variant="outlined"
                onPress={handleClearFilters}
                style={styles.clearButton}
              />
              <Button
                title="Apply Filters"
                variant="primary"
                onPress={() => setFiltersModalVisible(false)}
                style={styles.applyButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  filtersButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 80,
    alignItems: 'center',
  },
  filtersButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  categoriesList: {
    flex: 1,
  },
  categoriesContent: {
    padding: 15,
    flexGrow: 1,
  },
  createButtonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  createButton: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  filtersScroll: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});
export default ManageCategoriesScreen;