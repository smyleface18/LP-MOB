import { useEffect } from 'react';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { useAuthState, useAuthActions } from '@/store';
import { userService } from '@/features/auth/services/user.service';
import { Loading } from '@/shared/components/Loading';

/**
 * El rol (`user.userRole`) se resuelve ACÁ, una sola vez, apenas hay sesión —
 * no en cada dashboard por separado. Antes solo `UserDashboardScreen` pedía
 * `/auth/me`; como justo después del login `user` es null, la navegación
 * arrancaba asumiendo "no admin" y un admin podía quedar sin ver nunca las
 * tabs de Categorías/Preguntas si ese fetch particular fallaba o tardaba.
 * Ahora se espera a conocer el rol antes de decidir qué armar.
 */
export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthState();
  const { setUser } = useAuthActions();

  useEffect(() => {
    if (!isAuthenticated || user) return;

    let cancelled = false;
    (async () => {
      const response = await userService.getMe();
      if (cancelled) return;

      if (!response.ok || !response.data) {
        console.error('[AppNavigator] failed to load current user:', response.message);
        return;
      }

      setUser(response.data);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, setUser]);

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (!user) {
    return <Loading size={80} />;
  }

  return <MainTabs role={user.userRole} />;
};
