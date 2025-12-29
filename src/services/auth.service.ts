import { ResponseApi, SignUpDto } from "../types/type";
import { apiService } from "./api.service";
import { API_ENDPOINTS } from "./apiConfig";

export const AuthService = {
  async signUp(signUpDto: SignUpDto): Promise<ResponseApi<null>> {
    return await apiService.post<null>(API_ENDPOINTS.AUTH.SIGN_UP, {
      ...signUpDto,
    });
  },
};
