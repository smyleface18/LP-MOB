import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthSlice, AuthSlice } from './auth.slice';
import { createUiSlice, UiSlice } from './ui.slice';

// Tipo combinado del store completo
export type AppStore = AuthSlice & UiSlice;

// Store principal — único create() en toda la app
export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir lo necesario — no funciones
      partialize: (state) => ({
        accessToken: state.accessToken,
        idToken: state.idToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    },
  ),
);

// Selectores tipados — las features usan estos, nunca useAppStore directo con todo
export const useAuthState = () => useAppStore((s) => ({
  user: s.user,
  isAuthenticated: s.isAuthenticated,
  accessToken: s.accessToken,
}));

export const useAuthActions = () => useAppStore((s) => ({
  signInStatus: s.signInStatus,
  signOut: s.signOut,
  restoreSession: s.restoreSession,
}));

export const useUiState = () => useAppStore((s) => ({
  isLoading: s.isLoading,
  theme: s.theme,
}));

export const useUiActions = () => useAppStore((s) => ({
  setLoading: s.setLoading,
  setTheme: s.setTheme,
}));