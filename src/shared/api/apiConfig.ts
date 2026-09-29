export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'Falta EXPO_PUBLIC_API_BASE_URL. Crea un archivo .env en la raíz del proyecto (ver .env.example).',
  );
}
export const API_ENDPOINTS = {
  CATEGORIES: '/category-question',
  QUESTIONS: '/question',
  QUESTION_OPTIONS: '/question-options',
  MEDIA: {
    PRESIGN: '/media/presign',
    CONFIRM: (id: string) => `/media/${id}/confirm`,
  },
  STORY: {
    HISTORY: '/story/history',
    HISTORY_DETAIL: (storyId: string) => `/story/history/${storyId}`,
    CATALOG: '/story/catalog',
    CATALOG_DETAIL: (storyId: string) => `/story/catalog/${storyId}`,
    /** Reacción a una viñeta de una historieta guardada (historial o catálogo). */
    PANEL_REACTION: (storyId: string, order: number) =>
      `/story/catalog/${storyId}/panels/${order}/reaction`,
    /** PUT da like, DELETE lo quita. */
    LIKE: (storyId: string) => `/story/catalog/${storyId}/like`,
  },
  /** Solo ADMIN. */
  STATS: {
    ME: '/stats/me',
  },
  ADMIN: {
    STATS: '/admin/stats',
    STORIES: '/admin/stories',
    STORY: (storyId: string) => `/admin/stories/${storyId}`,
    REMOVE_STORY: (storyId: string) => `/admin/stories/${storyId}/remove`,
    RESTORE_STORY: (storyId: string) => `/admin/stories/${storyId}/restore`,
    REGENERATE_IMAGES: (storyId: string) => `/admin/stories/${storyId}/regenerate-images`,
  },
  AUTH: {
    SIGN_UP: '/auth/signUp',
    SIGN_IN: '/auth/signIn',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
    REVOKE_TOKEN: '/auth/revoke-token',
  },
};
