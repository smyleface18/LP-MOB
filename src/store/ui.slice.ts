import { StateCreator } from 'zustand';
import { Appearance } from 'react-native';

export type UiSlice = {
  isLoading: boolean;
  theme: 'light' | 'dark';
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  isLoading: false,
  // Arranca con el esquema del sistema operativo en vez de quedar fijo en
  // 'light'; ThemeProvider además lo mantiene sincronizado si el usuario
  // cambia el tema del sistema con la app abierta.
  theme: Appearance.getColorScheme() ?? 'light',
  setLoading: (loading) => set({ isLoading: loading }),
  setTheme: (theme) => set({ theme }),
});