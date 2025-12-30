import { apiService } from "./api/api.service";
import { API_ENDPOINTS } from "./api/apiConfig";
import { CategoryQuestion, ResponseApi } from "../types/type";

export interface CreateCategoryDto {
  level: string;
  descriptionCategory: string;
  type: string;
  active?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoryService = {
  // Obtener todas las categorías
  getAll: async (): Promise<ResponseApi<CategoryQuestion[]>> => {
    return apiService.get<CategoryQuestion[]>(API_ENDPOINTS.CATEGORIES);
  },

  // Obtener una categoría por ID
  getById: async (id: string): Promise<ResponseApi<CategoryQuestion>> => {
    return apiService.get<CategoryQuestion>(
      `${API_ENDPOINTS.CATEGORIES}/${id}`
    );
  },

  // Crear una nueva categoría
  create: async (
    data: CreateCategoryDto
  ): Promise<ResponseApi<CategoryQuestion>> => {
    return apiService.post<CategoryQuestion>(API_ENDPOINTS.CATEGORIES, data);
  },

  // Actualizar una categoría
  update: async (
    id: string,
    data: UpdateCategoryDto
  ): Promise<ResponseApi<CategoryQuestion>> => {
    return apiService.patch<CategoryQuestion>(
      `${API_ENDPOINTS.CATEGORIES}/${id}`,
      data
    );
  },

  // Eliminar una categoría
  delete: async (id: string): Promise<ResponseApi<void>> => {
    return apiService.delete<void>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
};
