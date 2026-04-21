import { useEffect, useRef, useCallback } from 'react';
import { useAuthState, useAuthActions } from '@/store';
import { AuthService } from '../services/auth.service';
import { decodeToken } from '@/shared/adapters/decode.adapter';

/**
 * Hook para manejar refresh automático de access token
 *
 * Estrategia:
 * - Token access dura 1 hora (3600 segundos)
 * - Refresh 5 minutos (300 segundos) antes de caducar
 * - Si falla refresh, hace logout automático
 * - Limpia timeouts en cleanup para evitar memory leaks
 */
export const useTokenRefresh = () => {
  const { accessToken, refreshToken } = useAuthState();
  const { updateTokens, signOut } = useAuthActions();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRefreshingRef = useRef(false);

  /**
   * Obtiene el tiempo hasta expiración en milisegundos
   */
  const getTimeUntilExpiration = useCallback((token: string): number | null => {
    console.log('🔍 Decodificando token para obtener tiempo de expiración...');
    const payload = decodeToken(token);
    if (!payload?.exp) return null;

    // exp está en segundos, convertir a milisegundos
    const expirationTime = payload.exp * 1000;
    const now = Date.now();
    const timeUntilExpiration = expirationTime - now;

    return timeUntilExpiration > 0 ? timeUntilExpiration : null;
  }, []);

  /**
   * Realiza el refresh del access token
   */
  const performRefresh = useCallback(async () => {
    // Evitar requests duplicados
    if (isRefreshingRef.current) {
      console.warn('⚠️ Refresh ya en progreso, ignorando...');
      return;
    }

    if (!refreshToken) {
      console.error('❌ No hay refresh token disponible');
      await signOut();
      return;
    }

    isRefreshingRef.current = true;

    try {
      console.log('🔄 Iniciando refresh de token...');
      const response = await AuthService.refreshAccessToken(refreshToken);

      if (!response.ok || !response.data) {
        console.error('❌ Refresh token falló:', response.message);
        // Refresh falló, hacer logout automático
        await signOut();
        isRefreshingRef.current = false;
        return;
      }

      // Actualizar tokens en el store y en storage
      await updateTokens(response.data);
      console.log('✅ Token refrescado exitosamente');

      // Programar siguiente refresh
      scheduleTokenRefresh(response.data.accessToken);
    } catch (error) {
      console.error('❌ Error al refrescar token:', error);
      // En caso de error, hacer logout automático
      await signOut();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshToken, updateTokens, signOut]);

  /**
   * Programa el siguiente refresh de token
   * Configura timeout para 5 minutos (300 segundos) antes de la expiración
   */
  const scheduleTokenRefresh = useCallback(
    async (token: string) => {
      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const timeUntilExpiration = getTimeUntilExpiration(token);

      if (timeUntilExpiration === null) {
        console.error('❌ No se pudo obtener tiempo de expiración del token');
        await signOut();
        return;
      }

      // Restar 5 minutos (300,000 ms) para refrescar antes de que caduque
      const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutos en milisegundos
      const timeUntilRefresh = timeUntilExpiration - REFRESH_THRESHOLD;

      if (timeUntilRefresh <= 0) {
        // Token caduca en menos de 5 minutos, refrescar inmediatamente
        console.warn('⚠️ Token caduca en menos de 5 minutos, refrescando ahora...');
        performRefresh();
      } else {
        // Programar refresh
        const minutes = Math.floor(timeUntilRefresh / 1000 / 60);
        const seconds = Math.floor((timeUntilRefresh / 1000) % 60);
        console.log(`⏱️ Próximo refresh programado en ${minutes}m ${seconds}s`);

        timeoutRef.current = setTimeout(() => {
          performRefresh();
        }, timeUntilRefresh);
      }
    },
    [getTimeUntilExpiration, performRefresh],
  );

  /**
   * Effect: Configura refresh automático cuando usuario está autenticado
   */
  useEffect(() => {
    if (!accessToken) {
      // Limpiar timeout si no hay token
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Programar primer refresh
    scheduleTokenRefresh(accessToken);

    // Cleanup: limpiar timeout cuando el componente se desmonta
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [accessToken, scheduleTokenRefresh]);

  return {
    performRefresh,
    getTimeUntilExpiration: (token?: string) => getTimeUntilExpiration(token || accessToken || ''),
  };
};
