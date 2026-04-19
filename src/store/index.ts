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
        user: state.user,
      }),
    },
  ),
);

// Selectores tipados — GRANULARES para evitar re-renders innecesarios
// Cada selector solo observa UNA propiedad específica, no crea nuevos objetos

// Auth State - Selectores individuales (máxima eficiencia)
export const useUser = () => useAppStore((s) => s.user);
export const useIsAuthenticated = () => useAppStore((s) => s.isAuthenticated);
export const useAccessToken = () => useAppStore((s) => s.accessToken);
export const useRefreshToken = () => useAppStore((s) => s.refreshToken);
export const useIdToken = () => useAppStore((s) => s.idToken);

// Auth Actions - Selectores individuales
export const useSignInStatus = () => useAppStore((s) => s.signInStatus);
export const useSignOut = () => useAppStore((s) => s.signOut);
export const useRestoreSession = () => useAppStore((s) => s.restoreSession);
export const useSetUser = () => useAppStore((s) => s.setUser);
export const useUpdateTokens = () => useAppStore((s) => s.updateTokens);

// Auth State - Selector combinado (para componentes que necesitan varios a la vez)
export const useAuthState = () => ({
  user: useAppStore((s) => s.user),
  isAuthenticated: useAppStore((s) => s.isAuthenticated),
  accessToken: useAppStore((s) => s.accessToken),
  refreshToken: useAppStore((s) => s.refreshToken),
  idToken: useAppStore((s) => s.idToken),
});

// Auth Actions - Selector combinado
export const useAuthActions = () => ({
  signInStatus: useAppStore((s) => s.signInStatus),
  signOut: useAppStore((s) => s.signOut),
  restoreSession: useAppStore((s) => s.restoreSession),
  setUser: useAppStore((s) => s.setUser),
  updateTokens: useAppStore((s) => s.updateTokens),
});

// UI State - Selectores individuales
export const useIsLoading = () => useAppStore((s) => s.isLoading);
export const useTheme = () => useAppStore((s) => s.theme);

// UI Actions - Selectores individuales
export const useSetLoading = () => useAppStore((s) => s.setLoading);
export const useSetTheme = () => useAppStore((s) => s.setTheme);

// UI State - Selector combinado
export const useUiState = () => ({
  isLoading: useAppStore((s) => s.isLoading),
  theme: useAppStore((s) => s.theme),
});

// UI Actions - Selector combinado
export const useUiActions = () => ({
  setLoading: useAppStore((s) => s.setLoading),
  setTheme: useAppStore((s) => s.setTheme),
});