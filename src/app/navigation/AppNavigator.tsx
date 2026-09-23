import { useEffect, useState } from 'react';
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
const ME_RETRY_MS = 3_000;

export const AppNavigator = () => {
  const { isAuthenticated, user, accessToken } = useAuthState();
  const { setUser } = useAuthActions();
  const [retry, setRetry] = useState(0);

  // Si falla (ej. al abrir la app con el access token vencido, antes de que se
  // renueve, o sin red) se reintenta: al cambiar el token y cada pocos
  // segundos. Antes quedaba en el Loading para siempre.
  useEffect(() => {
    if (!isAuthenticated || user) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      try {
        const response = await userService.getMe();
        if (cancelled) return;

        if (response.ok && response.data) {
          setUser(response.data);
          return;
        }
        console.error('[AppNavigator] failed to load current user:', response.message);
      } catch (error) {
        if (cancelled) return;
        console.error('[AppNavigator] failed to load current user:', error);
      }
      retryTimer = setTimeout(() => setRetry((n) => n + 1), ME_RETRY_MS);
    })();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [isAuthenticated, user, setUser, accessToken, retry]);

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (!user) {
    return <Loading size={80} />;
  }

  return <MainTabs role={user.userRole} />;
};
