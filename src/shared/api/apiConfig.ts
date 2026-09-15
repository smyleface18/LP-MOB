const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {

  throw new Error(
    'Falta EXPO_PUBLIC_API_BASE_URL. Crea un archivo .env en la raíz del proyecto (ver .env.example).'
  );
}
export const API_ENDPOINTS = {
  CATEGORIES: '/category-question',
  QUESTIONS: '/question',
  AUTH: {
    SIGN_UP: '/auth/signUp',
    SIGN_IN: '/auth/signIn',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
    REVOKE_TOKEN: '/auth/revoke-token',
  },
};
