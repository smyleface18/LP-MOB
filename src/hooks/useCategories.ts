import { useState, useEffect } from 'react';
import { CategoryQuestion } from '../types/type';
import { categoryService } from '../services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: any) => {
    try {
      setError(null);
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      const errorMessage = 'Error al crear la categoría';
      setError(errorMessage);
      console.error('Error creating category:', err);
      throw new Error(errorMessage);
    }
  };

  const updateCategory = async (id: string, categoryData: any) => {
    try {
      setError(null);
      const updatedCategory = await categoryService.update(id, categoryData);
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
      return updatedCategory;
    } catch (err) {
      const errorMessage = 'Error al actualizar la categoría';
      setError(errorMessage);
      console.error('Error updating category:', err);
      throw new Error(errorMessage);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await categoryService.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      const errorMessage = 'Error al eliminar la categoría';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      throw new Error(errorMessage);
    }
  };

  const toggleCategoryActive = async (id: string) => {
    try {
      setError(null);
      const category = categories.find(cat => cat.id === id);
      if (category) {
        const updatedCategory = await categoryService.update(id, { 
          active: !category.active 
        });
        setCategories(prev => prev.map(cat => 
          cat.id === id ? updatedCategory : cat
        ));
        return updatedCategory;
      }
    } catch (err) {
      const errorMessage = 'Error al cambiar el estado de la categoría';
      setError(errorMessage);
      console.error('Error toggling category active:', err);
      throw new Error(errorMessage);
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const getCategoriesByLevel = (level: string) => {
    return categories.filter(cat => cat.level === level);
  };

  const getCategoriesByType = (type: string) => {
    return categories.filter(cat => cat.type === type);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    // Estado
    categories,
    loading,
    error,
    
    // CRUD Operations
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    
    // Helper functions
    getCategoryById,
    getCategoriesByLevel,
    getCategoriesByType,
    
    // Estado derivado
    activeCategories: categories.filter(cat => cat.active),
    inactiveCategories: categories.filter(cat => !cat.active),
    totalCategories: categories.length,
  };
};