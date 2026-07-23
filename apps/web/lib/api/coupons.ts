// File: apps/web/lib/api/coupons.ts
// All coupon-related API calls

import apiClient from "./client";
import type {
  Coupon,
  CouponValidation,
  ApplyCouponInput,
  Cart,
} from "@/types/api";

export const couponsApi = {
  // Get all active coupons (public)
  getActiveCoupons: async (): Promise<Coupon[]> => {
    const response = await apiClient.get<Coupon[]>("/coupons");
    return response.data;
  },

  // Get single coupon info by code
  getCouponInfo: async (code: string): Promise<Coupon | null> => {
    try {
      const response = await apiClient.get<Coupon>(`/coupons/${code}`);
      return response.data;
    } catch {
      return null;
    }
  },

  // Validate coupon without applying
  validateCoupon: async (
    code: string,
    subtotal: number
  ): Promise<CouponValidation> => {
    const response = await apiClient.post<CouponValidation>(
      "/coupons/validate",
      { code } as ApplyCouponInput,
      { params: { subtotal } }
    );
    return response.data;
  },

  // Apply coupon to cart
  apply: async (code: string): Promise<Cart> => {
    const response = await apiClient.post<Cart>("/coupons/apply", {
      code,
    } as ApplyCouponInput);
    return response.data;
  },

  // Remove coupon from cart
  remove: async (): Promise<Cart> => {
    const response = await apiClient.delete<Cart>("/coupons/remove");
    return response.data;
  },
};