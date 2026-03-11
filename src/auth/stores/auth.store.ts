import { storageAdapter } from '@/shared/adapters/storage.adapter';
import { Authenticated, AuthState } from '../types';
import { createState } from '@/shared/adapters/state.adapater';

export const useAuthStore = createState<AuthState>((set) => ({
  accessToken: null,
  idToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  signInStatus: async (authenticated: Authenticated) => {
    await storageAdapter.set('accessToken', authenticated.accessToken);
    await storageAdapter.set('idToken', authenticated.idToken);
    await storageAdapter.set('refreshToken', authenticated.refreshToken);
    console.log('aqui');
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
      user: null,
      isAuthenticated: false,
    });
  },

  restoreSession: async () => {
    const refreshToken = await storageAdapter.get('accessToken');

    if (!refreshToken) return;

    set({
      isAuthenticated: true,
    });
  },
}));
