import { ApiResponse } from '@/shared/api/types';
import { Authenticated, SignUpDto } from '../types';
import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';

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
