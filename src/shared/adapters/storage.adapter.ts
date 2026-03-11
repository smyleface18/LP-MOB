import * as SecureStore from 'expo-secure-store';

export const storageAdapter = {
  async set(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },

  async get(key: string) {
    return SecureStore.getItemAsync(key);
  },

  async remove(key: string) {
    return SecureStore.deleteItemAsync(key);
  },
};
