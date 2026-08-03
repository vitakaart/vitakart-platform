// File: apps/web/lib/hooks/use-payment.ts
// Payment hooks — Razorpay integration with React Query

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { paymentsApi } from "@/lib/api/payments";
import { getErrorMessage } from "@/lib/api/client";
import type {
  CreatePaymentOrderResponse,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from "@/types/api";

// ==========================================
// MAIN HOOK: Handle full Razorpay flow
// ==========================================
export function useRazorpayPayment() {
  const router = useRouter();
  const queryClient = useQueryClient(); // ✅ NEW

  // Mutation 1: Create Razorpay order (backend call)
  const createOrderMutation = useMutation({
    mutationFn: paymentsApi.createOrder,
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Mutation 2: Verify payment (backend call)
  const verifyPaymentMutation = useMutation({
    mutationFn: paymentsApi.verifyPayment,
    onSuccess: () => {
      // ✅ Payment verified — NOW refresh cart, orders, coupons
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  // Main function: Complete payment flow
  const initiatePayment = async (orderId: string) => {
    try {
      // Step 1: Check if Razorpay script is loaded
      if (typeof window === "undefined" || !window.Razorpay) {
        toast.error("Payment system not ready. Please refresh and try again.");
        return;
      }

      // Step 2: Create Razorpay order on backend
      const paymentOrder: CreatePaymentOrderResponse =
        await createOrderMutation.mutateAsync({ orderId });

      // Step 3: Open Razorpay checkout modal
      const razorpay = new window.Razorpay({
        key: paymentOrder.razorpayKeyId,
        amount: paymentOrder.amountInPaise,
        currency: paymentOrder.currency,
        name: "Vitakart",
        description: `Order #${paymentOrder.orderNumber}`,
        image: "/logo.png",
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: paymentOrder.customerName,
          email: paymentOrder.customerEmail,
          contact: paymentOrder.customerPhone,
        },
        notes: {
          order_id: orderId,
          order_number: paymentOrder.orderNumber,
        },
        theme: {
          color: "#10B981",
        },
        // ==========================================
        // SUCCESS HANDLER
        // ==========================================
        handler: async (response: RazorpaySuccessResponse) => {
          const loadingToast = toast.loading("Verifying payment...");

          try {
            const result = await verifyPaymentMutation.mutateAsync({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.dismiss(loadingToast);

            if (result.success) {
              toast.success("Payment successful! 🎉");
              router.push(`/order-success/${result.orderNumber}`);
            } else {
              toast.error(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(getErrorMessage(error));
          }
        },
        // ==========================================
        // MODAL DISMISS HANDLER
        // ==========================================
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. Your order is saved as pending.");
          },
          escape: true,
          backdropclose: false,
        },
      });

      // Step 4: Handle payment failure event
      razorpay.on("payment.failed", async (response: RazorpayErrorResponse) => {
        toast.error(
          response.error.description || "Payment failed. Please try again."
        );

        try {
          await paymentsApi.reportFailure({
            orderId,
            razorpayOrderId: response.error.metadata?.order_id,
            errorCode: response.error.code,
            errorDescription: response.error.description,
          });
        } catch (err) {
          console.error("Failed to report payment failure:", err);
        }
      });

      // Step 5: Open the modal
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return {
    initiatePayment,
    isCreatingOrder: createOrderMutation.isPending,
    isVerifying: verifyPaymentMutation.isPending,
    isProcessing:
      createOrderMutation.isPending || verifyPaymentMutation.isPending,
  };
}