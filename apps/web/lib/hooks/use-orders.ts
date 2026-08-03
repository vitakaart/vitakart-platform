// File: apps/web/lib/hooks/use-orders.ts
// Orders data + mutations hook

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { PaymentMethod as PaymentMethodEnum } from "@/types/api";
import type {
  CreateOrderInput,
  CancelOrderInput,
  OrderStatus,
} from "@/types/api";

const ORDERS_QUERY_KEY = ["orders"];
const CART_QUERY_KEY = ["cart"];

// ==========================================
// GET MY ORDERS (Paginated)
// ==========================================
export function useMyOrders(params?: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: () => ordersApi.getMyOrders(params),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

// ==========================================
// GET SINGLE ORDER
// ==========================================
export function useOrder(orderId: string | undefined) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, orderId],
    queryFn: () => ordersApi.getOrderById(orderId!),
    enabled: isAuthenticated && !!orderId,
    staleTime: 30 * 1000,
  });
}

// ==========================================
// GET ORDER BY NUMBER
// ==========================================
export function useOrderByNumber(orderNumber: string | undefined) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "number", orderNumber],
    queryFn: () => ordersApi.getOrderByNumber(orderNumber!),
    enabled: isAuthenticated && !!orderNumber,
    staleTime: 30 * 1000,
  });
}

// ==========================================
// CREATE ORDER (CHECKOUT)
// ==========================================
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.createOrder(data),
    onSuccess: (order) => {
      // Only invalidate for COD (Razorpay does it after payment)
      const isRazorpay =
        order.paymentMethod === PaymentMethodEnum.Razorpay ||
        (order.paymentMethod as unknown as string) === "Razorpay" ||
        (order.paymentMethod as unknown as number) === 1;

      if (!isRazorpay) {
        // Cart cleared + orders + coupons refresh (COD only)
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ["coupons"] });

        toast.success("Order placed successfully!", {
          description: `Order #${order.orderNumber}`,
        });
        router.push(`/order-success/${order.orderNumber}`);
      }
      // For Razorpay: use-payment hook handles everything after verification
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// CANCEL ORDER
// ==========================================
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data?: CancelOrderInput;
    }) => ordersApi.cancelOrder(orderId, data),
    onSuccess: (order) => {
      queryClient.setQueryData([...ORDERS_QUERY_KEY, order.id], order);
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });

      // Invalidate coupons (usage refunded)
      queryClient.invalidateQueries({ queryKey: ["coupons"] });

      toast.success("Order cancelled", {
        description: "Stock has been restored",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
