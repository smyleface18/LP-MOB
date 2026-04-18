
import { User } from '@/shared/types/user';
import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { ApiResponse } from '@/shared/api/types';

export const userService = {
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  },
};
