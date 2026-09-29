import type { StoryListSource } from '@/features/story/types';

/**
 * Rutas de las listas de historietas y su detalle. Las registran el stack de
 * Explorar (el catálogo) y el de Perfil (el historial propio): mismos nombres
 * y parámetros, así las pantallas se reusan tal cual.
 */
export type StoryListStackParamList = {
  /** Sin `source`: el historial propio. `catalog`: las historietas de todos. */
  StoryHistory: { source?: StoryListSource } | undefined;
  StoryHistoryDetail: { storyId: string; source?: StoryListSource };
};
