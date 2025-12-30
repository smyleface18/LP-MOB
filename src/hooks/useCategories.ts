import { useState, useEffect } from "react";
import { CategoryQuestion } from "../types/type";
import { categoryService } from "../services/category.service";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    const response = await categoryService.getAll();
    if (!response.ok) {
      setError("Error al cargar las categorías");
      console.error("Error loading categories:", response.message);
      return;
    }
    setCategories(response.data!);
  };

  const createCategory = async (categoryData: any) => {
    setError(null);
    const response = await categoryService.create(categoryData);

    if (!response.ok) {
      setError("Error al crear la categoría");
      console.error("Error creating category:", response.message);
      return;
    }
    setCategories((prev) => [...prev, response.data!]);
    return response;
  };

  const updateCategory = async (id: string, categoryData: any) => {
    setError(null);
    const response = await categoryService.update(id, categoryData);

    if (!response.ok) {
      setError("Error al actualizar la categoría");
      console.error("Error creating category:", response.message);
      return;
    }

    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? response.data! : cat))
    );
    return response.data;
  };

  const deleteCategory = async (id: string) => {
    setError(null);
    const response = await categoryService.delete(id);

    if (!response.ok) {
      setError("Error al eliminar la categoría");
      console.error("Error deleting category:", response.message);
      return;
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const toggleCategoryActive = async (id: string) => {
    setError(null);
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      const response = await categoryService.update(id, {
        active: !category.active,
      });

      if (!response.ok) {
        setError("Error al cambiar el estado de la categoría");
        console.error("Error toggling category active:", response.message);
        return;
      }

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data! : cat))
      );

      return response;
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  const getCategoriesByLevel = (level: string) => {
    return categories.filter((cat) => cat.level === level);
  };

  const getCategoriesByType = (type: string) => {
    return categories.filter((cat) => cat.type === type);
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
    activeCategories: categories.filter((cat) => cat.active),
    inactiveCategories: categories.filter((cat) => !cat.active),
    totalCategories: categories.length,
  };
};
