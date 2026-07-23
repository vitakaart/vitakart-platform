// File: apps/web/lib/hooks/use-reviews.ts
// React Query hooks for reviews

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi } from "@/lib/api/reviews";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  CreateReviewInput,
  UpdateReviewInput,
  ReviewQueryParams,
} from "@/types/api";

// ==========================================
// QUERY KEYS
// ==========================================
const REVIEWS_KEY = (productId: string) => ["reviews", productId];
const STATS_KEY = (productId: string) => ["reviews", productId, "stats"];
const ELIGIBILITY_KEY = (productId: string) => ["reviews", productId, "eligibility"];
const MY_REVIEW_KEY = (productId: string) => ["reviews", productId, "my-review"];
const MY_REVIEWS_KEY = ["reviews", "my-reviews"];

// ==========================================
// GET PRODUCT REVIEWS (Paginated)
// ==========================================
export function useProductReviews(
  productId: string | undefined,
  params?: ReviewQueryParams
) {
  return useQuery({
    queryKey: [...REVIEWS_KEY(productId ?? ""), params],
    queryFn: () => reviewsApi.getProductReviews(productId!, params),
    enabled: !!productId,
    staleTime: 60 * 1000, // 1 min
  });
}

// ==========================================
// GET PRODUCT STATS ONLY
// ==========================================
export function useProductStats(productId: string | undefined) {
  return useQuery({
    queryKey: STATS_KEY(productId ?? ""),
    queryFn: () => reviewsApi.getProductStats(productId!),
    enabled: !!productId,
    staleTime: 60 * 1000,
  });
}

// ==========================================
// CHECK REVIEW ELIGIBILITY
// ==========================================
export function useReviewEligibility(productId: string | undefined) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ELIGIBILITY_KEY(productId ?? ""),
    queryFn: () => reviewsApi.checkEligibility(productId!),
    enabled: !!productId && isAuthenticated,
    staleTime: 30 * 1000,
  });
}

// ==========================================
// GET MY REVIEW FOR PRODUCT
// ==========================================
export function useMyReviewForProduct(productId: string | undefined) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: MY_REVIEW_KEY(productId ?? ""),
    queryFn: () => reviewsApi.getMyReviewForProduct(productId!),
    enabled: !!productId && isAuthenticated,
    staleTime: 60 * 1000,
  });
}

// ==========================================
// GET ALL MY REVIEWS
// ==========================================
export function useMyReviews() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: MY_REVIEWS_KEY,
    queryFn: () => reviewsApi.getMyReviews(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

// ==========================================
// CREATE REVIEW
// ==========================================
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsApi.create(data),
    onSuccess: (review) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: STATS_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: ELIGIBILITY_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: MY_REVIEW_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: MY_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: ["product-detail"] });
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });

      toast.success("Review posted successfully! ⭐");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// UPDATE REVIEW
// ==========================================
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewInput }) =>
      reviewsApi.update(id, data),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: STATS_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: MY_REVIEW_KEY(review.productId) });
      queryClient.invalidateQueries({ queryKey: MY_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: ["product-detail"] });

      toast.success("Review updated successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// DELETE REVIEW
// ==========================================
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["product-detail"] });
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });

      toast.success("Review deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}