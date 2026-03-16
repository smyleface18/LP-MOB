import { StateCreator } from 'zustand';

export type UiSlice = {
  isLoading: boolean;
  theme: 'light' | 'dark';
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  isLoading: false,
  theme: 'light',
  setLoading: (loading) => set({ isLoading: loading }),
  setTheme: (theme) => set({ theme }),
});