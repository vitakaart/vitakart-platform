// File: apps/web/lib/hooks/use-wishlist.ts
// React Query hooks for wishlist

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistApi } from "@/lib/api/wishlist";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const WISHLIST_KEY = ["wishlist"];
const WISHLIST_COUNT_KEY = ["wishlist", "count"];
const WISHLIST_IDS_KEY = ["wishlist", "product-ids"];

// ==========================================
// GET ALL WISHLIST ITEMS
// ==========================================
export function useMyWishlist() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: () => wishlistApi.getMyWishlist(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 min
  });
}

// ==========================================
// GET WISHLIST COUNT
// ==========================================
export function useWishlistCount() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: WISHLIST_COUNT_KEY,
    queryFn: () => wishlistApi.getCount(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

// ==========================================
// GET WISHLIST PRODUCT IDs (Bulk check for UI)
// ==========================================
export function useWishlistProductIds() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: WISHLIST_IDS_KEY,
    queryFn: () => wishlistApi.getProductIds(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

// ==========================================
// TOGGLE WISHLIST (Smart add/remove)
// ==========================================
export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.toggle(productId),
    onSuccess: (data) => {
      // Invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_KEY });

      // Show toast based on action
      if (data.isInWishlist) {
        toast.success("❤️ Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    },
    onError: (error) => {
      if (!isAuthenticated) {
        toast.error("Please login to add to wishlist");
      } else {
        toast.error(getErrorMessage(error));
      }
    },
  });
}

// ==========================================
// REMOVE FROM WISHLIST
// ==========================================
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_KEY });
      toast.success("Removed from wishlist");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// CLEAR WISHLIST
// ==========================================
export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_COUNT_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_KEY });
      toast.success("Wishlist cleared");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// HELPER: Check if product is in wishlist (from cache)
// ==========================================
export function useIsInWishlist(productId: string) {
  const { data: productIds } = useWishlistProductIds();
  return productIds?.includes(productId) ?? false;
}