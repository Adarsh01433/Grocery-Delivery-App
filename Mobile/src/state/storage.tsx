import { MMKV } from 'react-native-mmkv';

export const tokenStorage = new MMKV({
  id: 'token-storage',
});

export const storage = new MMKV({
  id: 'app-storage',
});

// 👉 Zustand persist ke liye wrapper
export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },

  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },

  removeItem: (key: string) => {
    storage.delete(key);
  },
};
