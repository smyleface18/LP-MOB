import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { ApiResponse } from '@/shared/api/types';
import { CategoryQuestion } from '@/shared/types/category-question';

export interface CreateCategoryDto {
  level: string;
  descriptionCategory: string;
  type: string;
  active?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoryService = {
  getAll: async (): Promise<ApiResponse<CategoryQuestion[]>> => {
    return apiService.get<CategoryQuestion[]>(API_ENDPOINTS.CATEGORIES);
  },
  getById: async (id: string): Promise<ApiResponse<CategoryQuestion>> => {
    return apiService.get<CategoryQuestion>(\/\);
  },
  create: async (data: CreateCategoryDto): Promise<ApiResponse<CategoryQuestion>> => {
    return apiService.post<CategoryQuestion>(API_ENDPOINTS.CATEGORIES, data);
  },
  update: async (id: string, data: UpdateCategoryDto): Promise<ApiResponse<CategoryQuestion>> => {
    return apiService.patch<CategoryQuestion>(\/\, data);
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(\/\);
  },
};
