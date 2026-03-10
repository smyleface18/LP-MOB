import { useEffect } from 'react';
import { ApiResponse, SignUpDto } from '../../types/type';
import { apiService } from '../api/api.service';
import { API_ENDPOINTS } from '../api/apiConfig';
import { useAuthStore } from './auth.store';
import { Authenticated } from './auth.type';

export const AuthService = {
  async signUp(signUpDto: SignUpDto): Promise<ApiResponse<null>> {
    return await apiService.post<null>(API_ENDPOINTS.AUTH.SIGN_UP, {
      ...signUpDto,
    });
  },

  async signIn(email: string, password: string): Promise<ApiResponse<Authenticated>> {
    const authenticated = await apiService.post<Authenticated>(API_ENDPOINTS.AUTH.SIGN_IN, {
      email,
      password,
    });
    console.log(authenticated);
    return authenticated;
  },
};
