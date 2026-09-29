import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { ApiResponse } from '@/shared/api/types';
import { AdminStats, PlayerStats } from './types';

/** Estadísticas reales de los dashboards (REST). */
export const statsService = {
  /** Las del usuario que pide. */
  me: async (): Promise<ApiResponse<PlayerStats>> =>
    apiService.get<PlayerStats>(API_ENDPOINTS.STATS.ME),

  /** Las de toda la app (solo ADMIN). */
  admin: async (): Promise<ApiResponse<AdminStats>> =>
    apiService.get<AdminStats>(API_ENDPOINTS.ADMIN.STATS),
};
