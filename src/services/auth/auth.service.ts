import { useEffect } from "react";
import { ResponseApi, SignUpDto } from "../../types/type";
import { apiService } from "../api/api.service";
import { API_ENDPOINTS } from "../api/apiConfig";
import { useAuthStore } from "./auth.store";
import { Authenticated } from "./auth.type";

export const AuthService = {
  async signUp(signUpDto: SignUpDto): Promise<ResponseApi<null>> {
    return await apiService.post<null>(API_ENDPOINTS.AUTH.SIGN_UP, {
      ...signUpDto,
    });
  },

  async signIn(
    email: string,
    password: string
  ): Promise<ResponseApi<Authenticated>> {
    return await apiService.post<Authenticated>(API_ENDPOINTS.AUTH.SIGN_IN, {
      email,
      password,
    });
  },
};
