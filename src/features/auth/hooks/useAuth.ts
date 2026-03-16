import { useState } from 'react';
import { AuthService } from '../services/auth.service';
import { Authenticated, SignUpDto } from '../types';
import { useAppStore } from '@/store';
import { ApiResponse } from '@/shared/api/types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const signInStatus = useAppStore((s) => s.signInStatus);

  const signUp = async (dto: SignUpDto): Promise<ApiResponse<null> | null> => {
    setLoading(true);
    setError(undefined);
    const response = await AuthService.signUp(dto);
    if (!response.ok) {
      setError(Array.isArray(response.message) ? response.message.join('\n') : response.message);
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
      setError(Array.isArray(response.message) ? response.message.join('\n') : response.message);
      setLoading(false);
      return response;
    }
    if (response.data) {
      await signInStatus(response.data);
    }
    setLoading(false);
    return response;
  };

  return { signUp, signIn, loading, error, signUpForm, setSignUpForm };
};