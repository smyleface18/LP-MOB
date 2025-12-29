import { SignUpDto } from "../types/type";
import { apiService } from "./api.service";
import { API_ENDPOINTS } from "./apiConfig";

export const AuthService = {
  async signUp(signUpDto: SignUpDto): Promise<any> {
    return await apiService.post<unknown>(API_ENDPOINTS.AUTH.SIGN_UP, {
      ...signUpDto,
    });
  },
};
