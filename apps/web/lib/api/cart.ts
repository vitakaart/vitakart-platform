// File: apps/web/lib/api/cart.ts
// Cart API methods

import apiClient from "./client";
import type { Cart, AddToCartInput, UpdateCartItemInput } from "@/types/api";

export const cartApi = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>("/cart");
    return response.data;
  },

  // Add item to cart
  addItem: async (data: AddToCartInput): Promise<Cart> => {
    const response = await apiClient.post<Cart>("/cart/items", data);
    return response.data;
  },

  // Update item quantity
  updateItem: async (itemId: string, data: UpdateCartItemInput): Promise<Cart> => {
    const response = await apiClient.put<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<Cart> => {
    const response = await apiClient.delete<Cart>("/cart");
    return response.data;
  },
};