// File: apps/web/lib/api/reviews.ts
// All review-related API calls

import apiClient from "./client";
import type {
  Review,
  PaginatedReviews,
  ProductReviewStats,
  ReviewEligibility,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewQueryParams,
} from "@/types/api";

export const reviewsApi = {
  // Get paginated reviews for a product (public)
  getProductReviews: async (
    productId: string,
    params?: ReviewQueryParams
  ): Promise<PaginatedReviews> => {
    const response = await apiClient.get<PaginatedReviews>(
      `/reviews/product/${productId}`,
      { params }
    );
    return response.data;
  },

  // Get review stats only (public)
  getProductStats: async (productId: string): Promise<ProductReviewStats> => {
    const response = await apiClient.get<ProductReviewStats>(
      `/reviews/product/${productId}/stats`
    );
    return response.data;
  },

  // Check if user can review this product (auth)
  checkEligibility: async (productId: string): Promise<ReviewEligibility> => {
    const response = await apiClient.get<ReviewEligibility>(
      `/reviews/product/${productId}/eligibility`
    );
    return response.data;
  },

  // Get user's review for a product (auth)
  getMyReviewForProduct: async (productId: string): Promise<Review | null> => {
    try {
      const response = await apiClient.get<Review>(
        `/reviews/product/${productId}/my-review`
      );
      return response.data;
    } catch {
      return null;
    }
  },

  // Get all my reviews
  getMyReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>("/reviews/my-reviews");
    return response.data;
  },

  // Create review
  create: async (data: CreateReviewInput): Promise<Review> => {
    const response = await apiClient.post<Review>("/reviews", data);
    return response.data;
  },

  // Update review
  update: async (id: string, data: UpdateReviewInput): Promise<Review> => {
    const response = await apiClient.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },
};