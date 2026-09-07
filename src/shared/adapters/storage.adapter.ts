import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const getWebStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
};

export const storageAdapter = {
  async set(key: string, value: string) {
    if (isWeb) {
      getWebStorage()?.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },

  async get(key: string) {
    if (isWeb) return getWebStorage()?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },

  async remove(key: string) {
    if (isWeb) {
      getWebStorage()?.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};
