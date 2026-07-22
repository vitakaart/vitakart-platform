// File: apps/web/lib/api/wishlist.ts
// All wishlist-related API calls

import apiClient from "./client";
import type {
  WishlistItem,
  WishlistToggleResponse,
  WishlistCountResponse,
  WishlistActionInput,
} from "@/types/api";

export const wishlistApi = {
  // Get all wishlist items
  getMyWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<WishlistItem[]>("/wishlist");
    return response.data;
  },

  // Get count only
  getCount: async (): Promise<WishlistCountResponse> => {
    const response = await apiClient.get<WishlistCountResponse>(
      "/wishlist/count"
    );
    return response.data;
  },

  // Get all product IDs (for bulk check)
  getProductIds: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/wishlist/product-ids");
    return response.data;
  },

  // Check if specific product is in wishlist
  checkProduct: async (productId: string): Promise<boolean> => {
    const response = await apiClient.get<boolean>(
      `/wishlist/check/${productId}`
    );
    return response.data;
  },

  // Toggle product (add if not exists, remove if exists)
  toggle: async (productId: string): Promise<WishlistToggleResponse> => {
    const response = await apiClient.post<WishlistToggleResponse>(
      "/wishlist/toggle",
      { productId } as WishlistActionInput
    );
    return response.data;
  },

  // Add product
  add: async (productId: string): Promise<WishlistToggleResponse> => {
    const response = await apiClient.post<WishlistToggleResponse>("/wishlist", {
      productId,
    } as WishlistActionInput);
    return response.data;
  },

  // Remove product
  remove: async (productId: string): Promise<WishlistToggleResponse> => {
    const response = await apiClient.delete<WishlistToggleResponse>(
      `/wishlist/${productId}`
    );
    return response.data;
  },

  // Clear entire wishlist
  clear: async (): Promise<void> => {
    await apiClient.delete("/wishlist");
  },
};