// File: apps/web/lib/api/categories.ts
// All category-related API calls

import apiClient from "./client";
import type { Category, CategoryTree } from "@/types/api";

export const categoriesApi = {
  // Get all categories (flat)
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  // Get top-level categories (no parent)
  getTopLevel: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories/top-level");
    return response.data;
  },

  // Get category tree (hierarchical)
  getTree: async (): Promise<CategoryTree[]> => {
    const response = await apiClient.get<CategoryTree[]>("/categories/tree");
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  },

  // Get sub-categories of a parent
  getSubCategories: async (parentId: string): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(
      `/categories/${parentId}/sub-categories`
    );
    return response.data;
  },
};