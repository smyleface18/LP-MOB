import { ApiResponse } from '@/shared/api/types';
import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import {
  CreateQuestionOptionDto,
  QuestionOption,
  UpdateQuestionOptionDto,
} from '@/shared/types/question-option';

export const questionOptionsService = {
  create: async (data: CreateQuestionOptionDto): Promise<ApiResponse<QuestionOption>> => {
    return apiService.post<QuestionOption>(API_ENDPOINTS.QUESTION_OPTIONS, data);
  },

  createMany: async (
    data: CreateQuestionOptionDto[],
  ): Promise<ApiResponse<QuestionOption[]>> => {
    return apiService.post<QuestionOption[]>(`${API_ENDPOINTS.QUESTION_OPTIONS}/batch`, data);
  },

  update: async (
    id: string,
    data: UpdateQuestionOptionDto,
  ): Promise<ApiResponse<QuestionOption>> => {
    return apiService.patch<QuestionOption>(`${API_ENDPOINTS.QUESTION_OPTIONS}/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`${API_ENDPOINTS.QUESTION_OPTIONS}/${id}`);
  },
};
