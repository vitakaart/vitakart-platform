// File: apps/web/components/orders/detail/use-order-detail.ts
// Fetches single order + cancel mutation

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

export function useOrderDetail(orderId: string | undefined) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // Fetch order
  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getOrderById(orderId!),
    enabled: isAuthenticated && !!orderId,
    staleTime: 30 * 1000,
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: (reason?: string) =>
      ordersApi.cancelOrder(orderId!, { reason }),
    onSuccess: (updatedOrder) => {
      // Update this order in cache
      queryClient.setQueryData(["order", orderId], updatedOrder);

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ["orders-infinite"] });

      toast.success("Order cancelled", {
        description: "Stock has been restored",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    cancelOrder: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
}