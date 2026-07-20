"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { OrdersHeader } from "@/components/orders/orders-header";
import { OrdersList } from "@/components/orders/orders-list";
import { OrdersLoadMore } from "@/components/orders/orders-load-more";
import { OrdersEndMessage } from "@/components/orders/orders-end-message";
import { OrdersFilterTabs } from "@/components/orders/orders-filter-tabs";
import { useInfiniteOrders } from "@/components/orders/use-infinite-orders";
import type { DateFilterId } from "@/components/orders/date-filter-types";
import { OrderStatus } from "@/types/api";

function OrdersContent() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterId>("all");

  const {
    orders,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    loadMoreRef,
  } = useInfiniteOrders({ statusFilter, dateFilter });

  const isEmpty = !isLoading && orders.length === 0;
  const hasAnyFilter = statusFilter !== null || dateFilter !== "all";

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FAFAF7] pb-20 md:pb-12">
        <div className="container-app max-w-3xl py-4 md:py-8">
          <OrdersHeader totalCount={totalCount} />

          {/* Sticky Filter Section */}
          <div className="mb-4 md:mb-5 sticky top-16 md:top-20 z-20 bg-[#FAFAF7]/95 backdrop-blur-md py-3 -mx-4 px-4 md:mx-0 md:px-0 md:py-2">
            <OrdersFilterTabs
              dateFilter={dateFilter}
              statusFilter={statusFilter}
              onDateChange={setDateFilter}
              onStatusChange={setStatusFilter}
            />
          </div>

          {isError && (
            <ErrorState
              title="Failed to load orders"
              onRetry={() => refetch()}
            />
          )}

          {!isError && isEmpty && (
            <EmptyState
              icon="📦"
              title={hasAnyFilter ? "No orders found" : "No orders yet"}
              description={
                hasAnyFilter
                  ? "Try changing the filter to see other orders."
                  : "When you place your first order, it will appear here."
              }
              size="lg"
            />
          )}

          {!isError && (isLoading || orders.length > 0) && (
            <>
              <OrdersList orders={orders} isLoading={isLoading} />

              <OrdersLoadMore
                loadMoreRef={loadMoreRef}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
              />

              {!hasNextPage && !isLoading && orders.length > 0 && (
                <OrdersEndMessage count={orders.length} />
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}