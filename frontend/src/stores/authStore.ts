import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email?: string | null;
  username?: string | null;
  display_name?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loginUrl: string | null;
  setSession: (user: AuthUser | null, token: string | null) => void;
  setLoginUrl: (loginUrl: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loginUrl: null,
      setSession: (user, token) => set({ user, token }),
      setLoginUrl: (loginUrl) => set({ loginUrl }),
      clear: () => set({ user: null, token: null, loginUrl: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
