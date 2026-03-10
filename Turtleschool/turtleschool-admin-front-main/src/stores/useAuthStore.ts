import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  setTokens: (accessToken: string, refreshToken: string, tokenExpiry: number) => void;
  clearTokens: () => void;
}

export const useAuthStore = create(
  persist<IAuthState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      setTokens: (accessToken, refreshToken, tokenExpiry) =>
        set({ accessToken, refreshToken, tokenExpiry }),
      clearTokens: () => set({ accessToken: null, refreshToken: null, tokenExpiry: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
