import { ResponseApi } from "../types/type";
import { apiService } from "./api/api.service";
import { API_ENDPOINTS } from "./api/apiConfig";
import { User } from "./auth/auth.type";

export const userService = {
  getMe: async (): Promise<ResponseApi<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  },
};
