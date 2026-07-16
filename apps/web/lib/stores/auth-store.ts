// File: apps/web/lib/stores/auth-store.ts
// Auth state management with Zustand
// Persists user session in localStorage

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { APP_CONFIG } from "@/lib/constants/config";
import type { User } from "@/types/api";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      // Set full auth data (login/register success)
      setAuth: ({ user, accessToken, refreshToken }) => {
        // Also save tokens to localStorage for axios interceptor
        if (typeof window !== "undefined") {
          localStorage.setItem(
            APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
            accessToken
          );
          localStorage.setItem(
            APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
            refreshToken
          );
        }

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // Update user info only (e.g., profile update)
      setUser: (user) => {
        set({ user });
      },

      // Clear all auth data (logout)
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Mark hydration complete (prevents SSR mismatch)
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: APP_CONFIG.STORAGE_KEYS.USER,
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Called after hydration from localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// ==========================================
// HELPER SELECTORS (for cleaner components)
// ==========================================

// Get just the user
export const useUser = () => useAuthStore((state) => state.user);

// Check if authenticated
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

// Check if hydrated (prevents flash)
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);