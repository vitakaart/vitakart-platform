// File: apps/web/types/api.ts
// TypeScript types for API responses

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

// Validation error format
export interface ValidationError {
  message: string;
  statusCode: 400;
  errors: Record<string, string[]>;
  timestamp: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// User info from auth
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "Customer" | "Vendor" | "Admin" | "SuperAdmin";
  isVerified: boolean;
}

// Auth response (login/register)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Register DTO
export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

// Login DTO
export interface LoginInput {
  email: string;
  password: string;
}

// Category
export interface Category {
  id: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  subCategoriesCount: number;
  createdAt: string;
  updatedAt: string | null;
}

// Category tree (nested)
export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  children: CategoryTree[];
}

// Product
export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  shortDescription: string | null;
  brand: string | null;
  price: number;
  discountPrice: number | null;
  finalPrice: number;
  discountPercentage: number | null;
  imageUrl: string | null;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// Product query params
export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: "name" | "price" | "newest" | "oldest";
  sortOrder?: "asc" | "desc";
}