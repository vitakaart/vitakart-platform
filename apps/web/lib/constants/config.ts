// File: apps/web/lib/constants/config.ts
// App-wide configuration

export const APP_CONFIG = {
  // App info
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Vitakart",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // API
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5208/api",

  // Tenant
  TENANT_SLUG: process.env.NEXT_PUBLIC_TENANT_SLUG || "vitakart",

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: "vitakart_access_token",
    REFRESH_TOKEN: "vitakart_refresh_token",
    USER: "vitakart_user",
  },

  // Timing
  TOAST_DURATION: 3000,
  API_TIMEOUT: 30000, // 30 seconds

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;