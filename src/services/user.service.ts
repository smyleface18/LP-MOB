import { ResponseApi } from '../types/type';
import { apiService } from '../shared/api/api.service';
import { API_ENDPOINTS } from '../shared/api/apiConfig';
import { User } from '../auth/types/auth.type';

export const userService = {
  getMe: async (): Promise<ResponseApi<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  },
};
