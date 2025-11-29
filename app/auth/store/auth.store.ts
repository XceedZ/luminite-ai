/**
 * Auth Store
 * State management untuk authentication menggunakan Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/@auth';
import { clearAuthData } from '@/utils/local-storage';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        set({ token });
        // Token is automatically saved by Zustand persist (authStorage)
        // Also save to authToken for API client compatibility
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('authToken', token);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
        // Auth data is automatically saved by Zustand persist (authStorage)
        // Also save token to authToken for API client compatibility
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('authToken', token);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        // Clear all auth data from localStorage
        clearAuthData();
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'authStorage', // localStorage key (camelCase)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
