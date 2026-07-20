// File: apps/web/lib/api/orders.ts
// Orders API methods

import apiClient from "./client";
import type {
  Order,
  PaginatedOrders,
  CreateOrderInput,
  CancelOrderInput,
  OrderStatus,
} from "@/types/api";

export const ordersApi = {
  // Create order from cart (checkout)
  createOrder: async (data: CreateOrderInput): Promise<Order> => {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  },

  // Get user's orders (paginated)
  getMyOrders: async (params?: {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
    fromDate?: string; // ISO date string
    toDate?: string; // ISO date string
  }): Promise<PaginatedOrders> => {
    const response = await apiClient.get<PaginatedOrders>("/orders", {
      params,
    });
    return response.data;
  },
  // Get single order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number (e.g., ORD-2025-000001)
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<Order>(
      `/orders/number/${orderNumber}`,
    );
    return response.data;
  },

  // Cancel order
  cancelOrder: async (
    orderId: string,
    data?: CancelOrderInput,
  ): Promise<Order> => {
    const response = await apiClient.post<Order>(
      `/orders/${orderId}/cancel`,
      data ?? {},
    );
    return response.data;
  },
};
