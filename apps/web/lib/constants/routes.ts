// File: apps/web/lib/constants/routes.ts
// All app routes in one place — easy to update

export const ROUTES = {
  // Public routes
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CATEGORIES: "/categories",
  CATEGORY: (slug: string) => `/category/${slug}`,
  SEARCH: "/search",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // User account routes (protected)
  ACCOUNT: "/account",
  ORDERS: "/account/orders",
  ORDER_DETAIL: (id: string) => `/account/orders/${id}`,
  PROFILE: "/account/profile",
  ADDRESSES: "/account/addresses",
  WISHLIST: "/account/wishlist",
  SETTINGS: "/account/settings",

  // Shopping routes
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order-success",

  // Static pages
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  SHIPPING: "/shipping",
  RETURNS: "/returns",
} as const;

// Routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.ACCOUNT,
  ROUTES.ORDERS,
  ROUTES.PROFILE,
  ROUTES.ADDRESSES,
  ROUTES.WISHLIST,
  ROUTES.SETTINGS,
  ROUTES.CHECKOUT,
];

// Routes that redirect to home if user is logged in
export const AUTH_ONLY_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];