import { StateCreator } from 'zustand';
import { storageAdapter } from '@/shared/adapters/storage.adapter';
import { Authenticated, AuthState } from '@/features/auth/types';

// Solo el estado y acciones de auth — sin create()
export type AuthSlice = AuthState;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
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
      user: null,
      isAuthenticated: false,
    });
  },

  restoreSession: async () => {
    const accessToken = await storageAdapter.get('accessToken');
    if (!accessToken) return;
    set({ isAuthenticated: true });
  },
});