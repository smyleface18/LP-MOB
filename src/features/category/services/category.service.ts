import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { ApiResponse } from '@/shared/api/types';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';

/**
 * Coincide con CreateCategoryQuestionDto del backend: OmitType(CategoryQuestion,
 * ['id','active','createdAt','updatedAt','questions']). `active` no se puede
 * enviar al crear — el ValidationPipe del backend (forbidNonWhitelisted) lo
 * rechazaría con 400.
 */
export interface CreateCategoryDto {
  level: Level;
  descriptionCategory: string;
  type: TypeQuestionCategory;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  active?: boolean;
}

export const categoryService = {
  getAll: async (): Promise<ApiResponse<CategoryQuestion[]>> => {
    return apiService.get<CategoryQuestion[]>(API_ENDPOINTS.CATEGORIES);
  },
  getById: async (id: string): Promise<ApiResponse<CategoryQuestion>> => {
    return apiService.get<CategoryQuestion>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
  create: async (data: CreateCategoryDto): Promise<ApiResponse<CategoryQuestion>> => {
    return apiService.post<CategoryQuestion>(API_ENDPOINTS.CATEGORIES, data);
  },
  update: async (id: string, data: UpdateCategoryDto): Promise<ApiResponse<CategoryQuestion>> => {
    return apiService.patch<CategoryQuestion>(`${API_ENDPOINTS.CATEGORIES}/${id}`, data);
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
};
