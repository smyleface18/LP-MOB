import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './auth.slice';
import { createUiSlice, UiSlice } from './ui.slice';

// Tipo combinado del store completo
export type AppStore = AuthSlice & UiSlice;

// Store principal — la persistencia de autenticacion la gestiona auth.slice.
export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUiSlice(...a),
}));

// Selectores tipados — GRANULARES para evitar re-renders innecesarios
// Cada selector solo observa UNA propiedad específica, no crea nuevos objetos

// Auth State - Selectores individuales (máxima eficiencia)
export const useUser = () => useAppStore((s) => s.user);
export const useIsAuthenticated = () => useAppStore((s) => s.isAuthenticated);
export const useAccessToken = () => useAppStore((s) => s.accessToken);
export const useRefreshToken = () => useAppStore((s) => s.refreshToken);
export const useIdToken = () => useAppStore((s) => s.idToken);

// Auth Actions
export const useSignInStatus = () => useAppStore((s) => s.signInStatus);
export const useSignOut = () => useAppStore((s) => s.signOut);
export const useRestoreSession = () => useAppStore((s) => s.restoreSession);
export const useSetUser = () => useAppStore((s) => s.setUser);
export const useUpdateTokens = () => useAppStore((s) => s.updateTokens);

// Auth State
export const useAuthState = () => ({
  user: useAppStore((s) => s.user),
  isAuthenticated: useAppStore((s) => s.isAuthenticated),
  accessToken: useAppStore((s) => s.accessToken),
  refreshToken: useAppStore((s) => s.refreshToken),
  idToken: useAppStore((s) => s.idToken),
});

// Auth Actions
export const useAuthActions = () => ({
  signInStatus: useAppStore((s) => s.signInStatus),
  signOut: useAppStore((s) => s.signOut),
  restoreSession: useAppStore((s) => s.restoreSession),
  setUser: useAppStore((s) => s.setUser),
  updateTokens: useAppStore((s) => s.updateTokens),
});

// UI State
export const useIsLoading = () => useAppStore((s) => s.isLoading);
export const useTheme = () => useAppStore((s) => s.theme);

// UI Actions
export const useSetLoading = () => useAppStore((s) => s.setLoading);
export const useSetTheme = () => useAppStore((s) => s.setTheme);

// UI State
export const useUiState = () => ({
  isLoading: useAppStore((s) => s.isLoading),
  theme: useAppStore((s) => s.theme),
});

// UI Actions
export const useUiActions = () => ({
  setLoading: useAppStore((s) => s.setLoading),
  setTheme: useAppStore((s) => s.setTheme),
});
