// File: apps/web/lib/api/auth.ts
// All auth-related API calls

import apiClient from "./client";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/types/api";

export const authApi = {
  // Register new user
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  // Login existing user
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  // Get current user info (requires token)
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  // Logout (revoke refresh token)
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/auth/logout", { refreshToken });
  },

  // Refresh access token
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },
};