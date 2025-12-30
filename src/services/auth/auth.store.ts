import { create } from "zustand";
import { Authenticated, AuthState } from "./auth.type";
import * as SecureStore from "expo-secure-store";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  idToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  signInStatus: async (authenticated: Authenticated) => {
    await SecureStore.setItemAsync("accessToken", authenticated.accessToken);
    await SecureStore.setItemAsync("idToken", authenticated.idToken);
    await SecureStore.setItemAsync("refreshToken", authenticated.refreshToken);

    set({
      accessToken: authenticated.accessToken,
      idToken: authenticated.idToken,
      refreshToken: authenticated.refreshToken,
      isAuthenticated: true,
    });
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("idToken");
    await SecureStore.deleteItemAsync("refreshToken");

    set({
      accessToken: null,
      idToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  restoreSession: async () => {
    const refreshToken = await SecureStore.getItemAsync("accessToken");

    if (!refreshToken) return;

    set({
      isAuthenticated: true,
    });
  },
}));
