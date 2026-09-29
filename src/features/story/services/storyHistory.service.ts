import { apiService } from '@/shared/api/api.service';
import { API_ENDPOINTS } from '@/shared/api/apiConfig';
import { ApiResponse } from '@/shared/api/types';
import {
  PanelReactions,
  StoredStoryManifest,
  StoryCatalogFilters,
  StoryHistoryPage,
  StoryLikes,
  StoryListSource,
} from '../types';

const LIST_ENDPOINT: Record<StoryListSource, string> = {
  history: API_ENDPOINTS.STORY.HISTORY,
  catalog: API_ENDPOINTS.STORY.CATALOG,
};

const DETAIL_ENDPOINT: Record<StoryListSource, (storyId: string) => string> = {
  history: API_ENDPOINTS.STORY.HISTORY_DETAIL,
  catalog: API_ENDPOINTS.STORY.CATALOG_DETAIL,
};

/**
 * Historietas terminadas (REST):
 * - `history`: solo las que jugó el usuario.
 * - `catalog`: las publicadas de todos los jugadores.
 * En cualquiera de las dos se puede reaccionar a cada viñeta y dar like.
 */
export const storyHistoryService = {
  /** De la más reciente a la más vieja. `filters` solo se aplica al catálogo. */
  list: async (
    page = 1,
    limit = 20,
    source: StoryListSource = 'history',
    filters: StoryCatalogFilters = {},
  ): Promise<ApiResponse<StoryHistoryPage>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (source === 'catalog') {
      if (filters.levels?.length) params.set('level', filters.levels.join(','));
      if (filters.search?.trim()) params.set('search', filters.search.trim());
    }
    return apiService.get<StoryHistoryPage>(`${LIST_ENDPOINT[source]}?${params.toString()}`);
  },
  /** Mismo formato que el manifiesto del review (`storyReviewReady`), con likes. */
  get: async (
    storyId: string,
    source: StoryListSource = 'history',
  ): Promise<ApiResponse<StoredStoryManifest>> => {
    return apiService.get<StoredStoryManifest>(DETAIL_ENDPOINT[source](storyId));
  },
  /** Reacción propia a una viñeta; null la quita. Devuelve las reacciones de la viñeta. */
  react: async (
    storyId: string,
    order: number,
    emoji: string | null,
  ): Promise<ApiResponse<{ order: number; reactions: PanelReactions }>> => {
    return apiService.put(API_ENDPOINTS.STORY.PANEL_REACTION(storyId, order), { emoji });
  },
  setLiked: async (storyId: string, liked: boolean): Promise<ApiResponse<StoryLikes>> => {
    const endpoint = API_ENDPOINTS.STORY.LIKE(storyId);
    return liked
      ? apiService.put<StoryLikes>(endpoint, {})
      : apiService.delete<StoryLikes>(endpoint);
  },
};
