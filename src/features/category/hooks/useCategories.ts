import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { categoryService, CreateCategoryDto, UpdateCategoryDto } from '../services/category.service';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await categoryService.getAll();
    if (!isMountedRef.current) return;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al cargar las categorías'));
      setLoading(false);
      return;
    }

    setCategories(response.data ?? []);
    setLoading(false);
  }, []);

  const createCategory = useCallback(async (data: CreateCategoryDto) => {
    setError(null);
    const response = await categoryService.create(data);
    if (!isMountedRef.current) return response;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al crear la categoría'));
      return response;
    }

    if (response.data) {
      setCategories((prev) => [...prev, response.data!]);
    }
    return response;
  }, []);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryDto) => {
    setError(null);
    const response = await categoryService.update(id, data);
    if (!isMountedRef.current) return response;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al actualizar la categoría'));
      return response;
    }

    if (response.data) {
      setCategories((prev) => prev.map((cat) => (cat.id === id ? response.data! : cat)));
    }
    return response;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setError(null);
    const response = await categoryService.delete(id);
    if (!isMountedRef.current) return response;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al eliminar la categoría'));
      return response;
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    return response;
  }, []);

  const toggleCategoryActive = useCallback(
    async (id: string) => {
      const category = categories.find((cat) => cat.id === id);
      if (!category) return;
      return updateCategory(id, { active: !category.active });
    },
    [categories, updateCategory],
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getCategoryById = useCallback(
    (id: string) => categories.find((cat) => cat.id === id),
    [categories],
  );
  const getCategoriesByLevel = useCallback(
    (level: Level) => categories.filter((cat) => cat.level === level),
    [categories],
  );
  const getCategoriesByType = useCallback(
    (type: TypeQuestionCategory) => categories.filter((cat) => cat.type === type),
    [categories],
  );

  const activeCategories = useMemo(() => categories.filter((cat) => cat.active), [categories]);
  const inactiveCategories = useMemo(() => categories.filter((cat) => !cat.active), [categories]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    getCategoryById,
    getCategoriesByLevel,
    getCategoriesByType,
    activeCategories,
    inactiveCategories,
    totalCategories: categories.length,
  };
};
