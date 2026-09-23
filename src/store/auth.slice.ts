import { StateCreator } from 'zustand';
import { storageAdapter } from '@/shared/adapters/storage.adapter';
import { Authenticated, AuthState, User } from '@/features/auth/types';

export type AuthSlice = AuthState;

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  accessToken: null,
  idToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  signInStatus: async (authenticated: Authenticated) => {
    await storageAdapter.set('accessToken', authenticated.accessToken);
    await storageAdapter.set('idToken', authenticated.idToken);
    await storageAdapter.set('refreshToken', authenticated.refreshToken);

    set({
      accessToken: authenticated.accessToken,
      idToken: authenticated.idToken,
      refreshToken: authenticated.refreshToken,
      isAuthenticated: true,
    });
  },

  signOut: async () => {
    await storageAdapter.remove('accessToken');
    await storageAdapter.remove('idToken');
    await storageAdapter.remove('refreshToken');
    set({
      accessToken: null,
      idToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
    });
  },

  // Carga los tokens guardados al abrir la app. Aunque el access token haya
  // vencido, con el refresh token la sesión sigue: useTokenRefresh lo renueva.
  restoreSession: async () => {
    const [accessToken, idToken, refreshToken] = await Promise.all([
      storageAdapter.get('accessToken'),
      storageAdapter.get('idToken'),
      storageAdapter.get('refreshToken'),
    ]);
    if (!accessToken && !refreshToken) return;

    set({ accessToken, idToken, refreshToken, isAuthenticated: true });
  },

  updateTokens: async (authenticated: Authenticated) => {
    // Cognito no devuelve un refresh token nuevo al refrescar: se conserva el
    // actual. (Antes quedaba en null y el siguiente refresh cerraba la sesión.)
    const refreshToken = authenticated.refreshToken || get().refreshToken;

    await storageAdapter.set('accessToken', authenticated.accessToken);
    await storageAdapter.set('idToken', authenticated.idToken);
    if (authenticated.refreshToken) {
      await storageAdapter.set('refreshToken', authenticated.refreshToken);
    }

    set({
      accessToken: authenticated.accessToken,
      idToken: authenticated.idToken,
      refreshToken,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },
});
