import { useActionState, useState } from 'react';
import { userService } from '../services/user.service';
import { useAuthActions, useAuthState } from '@/store';

export const useUser = () => {
  const  { user }  = useAuthState();
  const { setUser } = useAuthActions();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getMe = async () => {
    setLoading(true);
    const response = await userService.getMe();


    if (!response.ok) {
      const message = Array.isArray(response.message)
        ? response.message.join(' ')
        : response.message ?? 'Unknown error';
      setError(message);
      setLoading(false);
      return;
    }

    setUser(response.data!);
    setLoading(false);
    return response;
  };

  return {
    user,
    setUser,
    error,
    setError,
    getMe,
    loading,
    setLoading,
  };
};
