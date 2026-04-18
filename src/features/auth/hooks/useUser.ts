import { useState } from 'react';
import { userService } from '../services/user.service';
import { User, UserRole } from '@/shared/types/user';
import { Level } from '@/shared/types/common';

export const useUser = () => {
  const [user, setUser] = useState<User>({
    id: '',
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: undefined,
    username: '',
    email: '',
    score: 0,
    userRole: UserRole.PLAYER,
    level: Level.A1,
  });

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
