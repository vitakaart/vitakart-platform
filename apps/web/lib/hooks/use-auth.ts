// File: apps/web/lib/hooks/use-auth.ts
// Fixed: Better error handling + loading state reset

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";
import type { LoginInput, RegisterInput } from "@/types/api";

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, refreshToken, user, isAuthenticated } =
    useAuthStore();

  // ==========================================
  // LOGIN MUTATION
  // ==========================================
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success(`Welcome back, ${data.user.fullName}!`);
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
      console.error("Login error:", error);
    },
  });

  // ==========================================
  // REGISTER MUTATION
  // ==========================================
  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success(`Welcome to Vitakart, ${data.user.fullName}!`);
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
      console.error("Register error:", error);
    },
  });

  // ==========================================
  // LOGOUT MUTATION
  // ==========================================
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        try {
          await authApi.logout(refreshToken);
        } catch (error) {
          // Silent fail — still logout locally
          console.error("Logout API error:", error);
        }
      }
    },
    onSettled: () => {
      clearAuth();
      toast.success("Logged out successfully");
      router.push(ROUTES.HOME);
    },
  });

  return {
    // State
    user,
    isAuthenticated,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Error states (bonus — for debugging)
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}