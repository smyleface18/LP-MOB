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
  const signOut = useAppStore((s) => s.signOut);
  const refreshToken = useAppStore((s) => s.refreshToken);

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
    setError(undefined);
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

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(undefined);

      // Revocar refresh token en el backend
      const token = useAppStore.getState().refreshToken;
      if (token) {
        await AuthService.revokeToken(token).catch((err) => {
          console.warn('⚠️ Error revocando token en el servidor:', err);
          // Continuar con logout local incluso si falla la revocación
        });
      }

      // Limpiar estado local
      await signOut();
    } catch (err) {
      console.error('❌ Error en Sign Out:', err);
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return { signUp, signIn, handleSignOut, loading, error, signUpForm, setSignUpForm };
};