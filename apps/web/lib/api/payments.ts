// File: apps/web/lib/api/payments.ts
// Payment API calls to backend

import apiClient from "./client";
import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  PaymentFailureRequest,
} from "@/types/api";

export const paymentsApi = {
  /**
   * Create Razorpay order for an existing Vitakart order
   * Called when user clicks "Pay Online" on checkout
   */
  createOrder: async (
    data: CreatePaymentOrderRequest
  ): Promise<CreatePaymentOrderResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: CreatePaymentOrderResponse;
    }>("/payments/create-order", data);

    return response.data.data;
  },

  /**
   * Verify Razorpay payment after user completes checkout
   * SECURITY: Backend verifies signature to prevent fake payments
   */
  verifyPayment: async (
    data: VerifyPaymentRequest
  ): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: VerifyPaymentResponse;
    }>("/payments/verify", data);

    return response.data.data;
  },

  /**
   * Report payment failure to backend for tracking
   */
  reportFailure: async (data: PaymentFailureRequest): Promise<void> => {
    await apiClient.post("/payments/failure", data);
  },
};