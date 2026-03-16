import { useState, useEffect } from 'react';
import { CategoryQuestion } from '@/shared/types/category-question';
import { categoryService } from '../services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    const response = await categoryService.getAll();
    if (!response.ok) { setError('Error al cargar las categorias'); return; }
    setCategories(response.data!);
    setLoading(false);
  };

  const createCategory = async (data: any) => {
    const response = await categoryService.create(data);
    if (!response.ok) { setError('Error al crear'); return; }
    setCategories((prev) => [...prev, response.data!]);
    return response;
  };

  const updateCategory = async (id: string, data: any) => {
    const response = await categoryService.update(id, data);
    if (!response.ok) { setError('Error al actualizar'); return; }
    setCategories((prev) => prev.map((cat) => (cat.id === id ? response.data! : cat)));
    return response.data;
  };

  const deleteCategory = async (id: string) => {
    const response = await categoryService.delete(id);
    if (!response.ok) { setError('Error al eliminar'); return; }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const toggleCategoryActive = async (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;
    const response = await categoryService.update(id, { active: !category.active });
    if (!response.ok) { setError('Error al cambiar estado'); return; }
    setCategories((prev) => prev.map((cat) => (cat.id === id ? response.data! : cat)));
    return response;
  };

  const getCategoryById = (id: string) => categories.find((cat) => cat.id === id);
  const getCategoriesByLevel = (level: string) => categories.filter((cat) => cat.level === level);
  const getCategoriesByType = (type: string) => categories.filter((cat) => cat.type === type);

  useEffect(() => { loadCategories(); }, []);

  return {
    categories, loading, error,
    loadCategories, createCategory, updateCategory, deleteCategory, toggleCategoryActive,
    getCategoryById, getCategoriesByLevel, getCategoriesByType,
    activeCategories: categories.filter((cat) => cat.active),
    inactiveCategories: categories.filter((cat) => !cat.active),
    totalCategories: categories.length,
  };
};
