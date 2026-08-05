import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { paymentsApi } from "@/lib/api/payments";
import { getErrorMessage } from "@/lib/api/client";
import { loadRazorpayScript } from "@/lib/razorpay-loader";
import type {
  CreatePaymentOrderResponse,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from "@/types/api";

export function useRazorpayPayment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoadingScript, setIsLoadingScript] = useState(false);

  // Create Razorpay order on backend
  const createOrderMutation = useMutation({
    mutationFn: paymentsApi.createOrder,
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Verify payment signature on backend
  const verifyPaymentMutation = useMutation({
    mutationFn: paymentsApi.verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const initiatePayment = async (orderId: string) => {
    try {
      // Step 1: Load Razorpay script dynamically
      setIsLoadingScript(true);
      const loadingToast = toast.loading("Preparing payment...");

      try {
        await loadRazorpayScript();
        toast.dismiss(loadingToast);
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(
          error instanceof Error
            ? error.message
            : "Payment system unavailable. Please try again."
        );
        return;
      } finally {
        setIsLoadingScript(false);
      }

      // Step 2: Verify Razorpay is available
      if (!window.Razorpay) {
        toast.error("Payment system not ready. Please refresh and try again.");
        return;
      }

      // Step 3: Create Razorpay order on backend
      const paymentOrder: CreatePaymentOrderResponse =
        await createOrderMutation.mutateAsync({ orderId });

      // Step 4: Configure and open Razorpay checkout
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

        // Payment success handler
        handler: async (response: RazorpaySuccessResponse) => {
          const verifyToast = toast.loading("Verifying payment...");

          try {
            const result = await verifyPaymentMutation.mutateAsync({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.dismiss(verifyToast);

            if (result.success) {
              toast.success("Payment successful");
              router.push(`/order-success/${result.orderNumber}`);
            } else {
              toast.error(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (error) {
            toast.dismiss(verifyToast);
            toast.error(getErrorMessage(error));
          }
        },

        // Modal close handler
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. Your order is saved as pending.");
          },
          escape: true,
          backdropclose: false,
        },
      });

      // Payment failure handler
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

      // Step 5: Open the payment modal
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return {
    initiatePayment,
    isLoadingScript,
    isCreatingOrder: createOrderMutation.isPending,
    isVerifying: verifyPaymentMutation.isPending,
    isProcessing:
      isLoadingScript ||
      createOrderMutation.isPending ||
      verifyPaymentMutation.isPending,
  };
}