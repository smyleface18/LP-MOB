import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { ApiResponse } from '@/shared/api/types';
import {
  AdminStoriesQuery,
  AdminStoryDetail,
  AdminStoryPage,
  RegenerateImagesResult,
  RemoveStoryInput,
} from './types';

/** Moderación de historietas (REST, solo ADMIN). */
export const storyAdminService = {
  /** Publicadas y quitadas, de la más reciente a la más vieja. */
  list: async ({
    page,
    limit,
    visibility,
    search,
  }: AdminStoriesQuery): Promise<ApiResponse<AdminStoryPage>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (visibility) params.set('visibility', visibility);
    if (search?.trim()) params.set('search', search.trim());
    return apiService.get<AdminStoryPage>(`${API_ENDPOINTS.ADMIN.STORIES}?${params.toString()}`);
  },

  /** Resumen, jugadores, remoción y la historieta completa (también si fue quitada). */
  get: async (storyId: string): Promise<ApiResponse<AdminStoryDetail>> => {
    return apiService.get<AdminStoryDetail>(API_ENDPOINTS.ADMIN.STORY(storyId));
  },

  /** La quita (borrado lógico): deja de verse en el catálogo y en el historial. */
  remove: async (
    storyId: string,
    input: RemoveStoryInput,
  ): Promise<ApiResponse<AdminStoryDetail>> => {
    return apiService.post<AdminStoryDetail>(API_ENDPOINTS.ADMIN.REMOVE_STORY(storyId), input);
  },

  /**
   * Vuelve a dibujar las viñetas sin imagen. Responde enseguida; las imágenes
   * llegan después (se ven al recargar el detalle).
   */
  regenerateImages: async (storyId: string): Promise<ApiResponse<RegenerateImagesResult>> => {
    return apiService.post<RegenerateImagesResult>(
      API_ENDPOINTS.ADMIN.REGENERATE_IMAGES(storyId),
      {},
    );
  },

  /** La vuelve a publicar (catálogo e historial de sus jugadores). */
  restore: async (storyId: string, note?: string): Promise<ApiResponse<AdminStoryDetail>> => {
    return apiService.post<AdminStoryDetail>(
      API_ENDPOINTS.ADMIN.RESTORE_STORY(storyId),
      note ? { note } : {},
    );
  },
};
