import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { ApiResponse } from '@/shared/api/types';
import { statsService } from './stats.service';
import { AdminStats, PlayerStats } from './types';

/**
 * Pide unas estadísticas cada vez que la pantalla vuelve a estar en foco (ej.
 * después de una partida) y deja pedirlas a mano con `refresh`.
 */
const useStatsRequest = <T>(request: () => Promise<ApiResponse<T>>, fallback: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Si una respuesta vieja llega después de una nueva, se descarta.
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      if (id !== requestId.current) return;
      if (response.ok && response.data) setData(response.data);
      else setError(getErrorMessage(response.message, fallback));
    } catch {
      if (id === requestId.current) setError('Could not connect to the server');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [request, fallback]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { data, loading, error, refresh };
};

/** Estadísticas del jugador (`GET /stats/me`). */
export const usePlayerStats = () =>
  useStatsRequest<PlayerStats>(statsService.me, 'Could not load your stats');

/** Estadísticas de la app (`GET /admin/stats`, solo ADMIN). */
export const useAdminStats = () =>
  useStatsRequest<AdminStats>(statsService.admin, 'No se pudieron cargar las estadísticas');
