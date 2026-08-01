// File: apps/web/lib/hooks/use-auth.ts
// Auto-fetch fresh user on mount + all auth mutations

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { authApi } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";
import type { LoginInput, RegisterInput } from "@/types/api";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    setAuth,
    setUser,
    clearAuth,
    refreshToken,
    user,
    isAuthenticated,
  } = useAuthStore();

  // ==========================================
  // ✅ AUTO-FETCH FRESH USER DATA
  // Runs on mount + when authenticated
  // Ensures user data is ALWAYS fresh from backend
  // ==========================================
  const { data: freshUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated && !!user,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true, // Refetch when tab gains focus
    refetchOnMount: true, // Always refetch on mount
  });

  // ✅ Update Zustand store when fresh data arrives
  useEffect(() => {
    if (freshUser) {
      setUser(freshUser);
    }
  }, [freshUser, setUser]);

  // ==========================================
  // LOGIN
  // ==========================================
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      // Invalidate auth queries to fetch fresh
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success(`Welcome back, ${data.user.fullName}!`);
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  // ==========================================
  // REGISTER
  // ==========================================
  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success(`Welcome to Vitakart, ${data.user.fullName}!`);
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  // ==========================================
  // LOGOUT
  // ==========================================
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        try {
          await authApi.logout(refreshToken);
        } catch (error) {
          console.error("Logout API error:", error);
        }
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push(ROUTES.HOME);
    },
  });

  return {
    // ✅ Return fresh user if available, else Zustand user
    user: freshUser || user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}