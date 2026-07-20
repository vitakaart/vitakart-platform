// File: apps/web/lib/hooks/use-cart.ts
// Cart data + mutations hook

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import type { AddToCartInput } from "@/types/api";

const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const openCartDrawer = useCartStore((state) => state.open);

  // Fetch cart (only if authenticated)
  const {
    data: cart,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartApi.getCart(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Add to cart mutation
  const addToCart = useMutation({
    mutationFn: (data: AddToCartInput) => cartApi.addItem(data),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
      toast.success("Added to cart!", {
        description: `${updatedCart.totalItems} items in cart`,
        action: {
          label: "View Cart",
          onClick: () => openCartDrawer(),
        },
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Update quantity mutation
  const updateQuantity = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, { quantity }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Remove item mutation
  const removeItem = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
      toast.success("Item removed");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Clear cart mutation
  const clearCart = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    // Data
    cart,
    itemCount: cart?.totalItems ?? 0,
    isEmpty: !cart || cart.items.length === 0,
    isLoading,
    isError,

    // Actions
    addToCart: addToCart.mutate,
    updateQuantity: updateQuantity.mutate,
    removeItem: removeItem.mutate,
    clearCart: clearCart.mutate,
    refetch,

    // Loading states
    isAdding: addToCart.isPending,
    isUpdating: updateQuantity.isPending,
    isRemoving: removeItem.isPending,
    isClearing: clearCart.isPending,
  };
}