// File: apps/web/lib/api/products.ts
// All product-related API calls

import apiClient from "./client";
import type {
  PaginatedResponse,
  Product,
  ProductQuery,
} from "@/types/api";

export const productsApi = {
  // Get paginated products with filters
  getAll: async (query?: ProductQuery): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "/products",
      { params: query }
    );
    return response.data;
  },

  // Get featured products
  getFeatured: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products/featured", {
      params: { limit },
    });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug (SEO URLs)
  getBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  // Get products by category
  getByCategory: async (
    categoryId: string,
    query?: ProductQuery
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/category/${categoryId}`,
      { params: query }
    );
    return response.data;
  },
};