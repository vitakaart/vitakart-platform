// apps/web/app/account/orders/page.tsx
"use client";

import { useState } from "react";
import { AccountLayout } from "@/components/account/account-layout";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { OrdersList } from "@/components/orders/orders-list";
import { OrdersLoadMore } from "@/components/orders/orders-load-more";
import { OrdersEndMessage } from "@/components/orders/orders-end-message";
import { OrdersFilterTabs } from "@/components/orders/orders-filter-tabs";
import { useInfiniteOrders } from "@/components/orders/use-infinite-orders";
import type { DateFilterId } from "@/components/orders/date-filter-types";
import { OrderStatus } from "@/types/api";
import { ROUTES } from "@/lib/constants/routes";
import { Package } from "lucide-react";

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
    <>
      {/* Page header — replaces OrdersHeader */}
      <AccountPageHeader
        title="My Orders"
        subtitle={
          totalCount > 0
            ? `${totalCount} ${totalCount === 1 ? "order" : "orders"} in total`
            : "Track and manage all your orders"
        }
        backHref={ROUTES.ACCOUNT}
        action={
          totalCount > 0 && (
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 md:inline-flex">
              <Package className="h-3.5 w-3.5" />
              {totalCount} {totalCount === 1 ? "order" : "orders"}
            </div>
          )
        }
      />

      {/* Sticky Filter Section */}
      <div className="sticky top-16 z-20 -mx-4 mb-4 bg-gradient-to-b from-slate-50 to-slate-50/95 px-4 py-3 backdrop-blur-md md:top-4 md:mx-0 md:mb-5 md:rounded-2xl md:border md:border-slate-100 md:bg-white md:px-4 md:py-3 md:shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
        <OrdersFilterTabs
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          onDateChange={setDateFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Error state */}
      {isError && (
        <ErrorState
          title="Failed to load orders"
          onRetry={() => refetch()}
        />
      )}

      {/* Empty state */}
      {!isError && isEmpty && (
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
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
        </div>
      )}

      {/* Orders list */}
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
    </>
  );
}

export default function OrdersPage() {
  return (
    <AccountLayout>
      <OrdersContent />
    </AccountLayout>
  );
}