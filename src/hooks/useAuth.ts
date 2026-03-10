import { useEffect, useState } from 'react';
import { AuthService } from '../services/auth/auth.service';
import { Authenticated } from '../services/auth/auth.type';
import { useAuthStore } from '../services/auth/auth.store';
import { ApiResponse, SignUpDto } from '@/types/type';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | string[] | undefined>(undefined);

  const [signUpForm, setSignUpForm] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const { signInStatus } = useAuthStore();

  const signUp = async (dto: SignUpDto): Promise<ApiResponse<null> | null> => {
    setLoading(true);
    setError(undefined);

    const response = await AuthService.signUp(dto);
    if (!response.ok) {
      setError(response.message);
      setLoading(false);
      return response;
    }

    setLoading(false);
    return response;
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<ApiResponse<Authenticated> | null> => {
    setLoading(true);

    const response = await AuthService.signIn(email, password);
    if (!response.ok) {
      setError(response.message);
      setLoading(false);
      return response;
    }

    if (response.ok && response.data) {
      signInStatus(response.data!);
    }

    setLoading(false);
    return response;
  };

  return {
    signUp,
    loading,
    error,
    signUpForm,
    setSignUpForm,
    signIn,
  };
};
