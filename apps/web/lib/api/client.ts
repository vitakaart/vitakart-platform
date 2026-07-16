// File: apps/web/lib/api/client.ts
// Fixed: Don't try to refresh on login/register endpoints

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { APP_CONFIG } from "@/lib/constants/config";

// Create axios instance
const apiClient = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("X-Tenant-Slug", APP_CONFIG.TENANT_SLUG);

    if (typeof window !== "undefined") {
      const token = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

// Endpoints that should NOT trigger token refresh
const NO_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if this is an auth endpoint (login/register) — don't refresh
    const isAuthEndpoint = NO_REFRESH_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // Only try refresh for non-auth 401s
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint &&
      typeof window !== "undefined"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(
        APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN
      );

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${APP_CONFIG.API_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-Slug": APP_CONFIG.TENANT_SLUG,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem(
          APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
          accessToken
        );
        localStorage.setItem(
          APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
          newRefreshToken
        );

        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For auth endpoints or non-401 errors — just reject
    return Promise.reject(error);
  }
);

// Helper: Clear auth data and redirect
function handleLogout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);

  const currentPath = window.location.pathname;
  if (!["/login", "/register"].includes(currentPath)) {
    window.location.href = "/login";
  }
}

// ==========================================
// ERROR MESSAGE HELPER (Improved)
// ==========================================
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Network error (backend down)
    if (!error.response) {
      return "Network error. Please check your connection.";
    }

    // Validation errors (400 with errors object)
    if (error.response.status === 400 && error.response.data?.errors) {
      const errors = error.response.data.errors as Record<string, string[]>;
      const firstError = Object.values(errors)[0];
      return firstError?.[0] || "Validation failed";
    }

    // Standard error message from backend
    if (error.response.data?.message) {
      return error.response.data.message;
    }

    // Fallback based on status code
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Invalid email or password";
      case 403:
        return "You don't have permission to do this";
      case 404:
        return "Not found";
      case 429:
        return "Too many requests. Please wait and try again.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message || "Something went wrong";
    }
  }

  return "An unexpected error occurred";
}

export default apiClient;