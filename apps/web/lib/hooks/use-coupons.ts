// File: apps/web/lib/hooks/use-coupons.ts
// React Query hooks for coupons

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponsApi } from "@/lib/api/coupons";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const COUPONS_KEY = ["coupons"];
const CART_KEY = ["cart"];

// ==========================================
// GET ACTIVE COUPONS
// ==========================================
export function useActiveCoupons() {
  return useQuery({
    queryKey: COUPONS_KEY,
    queryFn: () => couponsApi.getActiveCoupons(),
    staleTime: 30 * 1000, // 30 sec (was 5 min)
    refetchOnWindowFocus: true, // Refresh when tab active
  });
}

// ==========================================
// APPLY COUPON
// ==========================================
export function useApplyCoupon() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useMutation({
    mutationFn: (code: string) => couponsApi.apply(code),
    onSuccess: (cart) => {
      // Update cart cache
      queryClient.setQueryData(CART_KEY, cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });

      const savings = cart.couponDiscount;
      toast.success(`🎉 Coupon applied! You saved ₹${savings.toLocaleString("en-IN")}`);
    },
    onError: (error) => {
      if (!isAuthenticated) {
        toast.error("Please login to apply coupons");
      } else {
        toast.error(getErrorMessage(error));
      }
    },
  });
}

// ==========================================
// REMOVE COUPON
// ==========================================
export function useRemoveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => couponsApi.remove(),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_KEY, cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      toast.success("Coupon removed");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}