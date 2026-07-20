"use client";

import { OrderCard } from "./order-card";
import { Skeleton } from "@/components/shared/loading-state";
import type { OrderListItem } from "@/types/api";

interface Props {
  orders: OrderListItem[];
  isLoading: boolean;
  skeletonCount?: number;
}

// Thin skeleton matching new card layout
function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-stone-100 px-4 py-3">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-2.5 w-40" />
      </div>

      <div className="space-y-1 shrink-0">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-2 w-12 ml-auto" />
      </div>
    </div>
  );
}

export function OrdersList({ orders, isLoading, skeletonCount = 6 }: Props) {
  return (
    <div className="space-y-2">
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <OrderRowSkeleton key={i} />
        ))}

      {!isLoading &&
        orders.map((order) => <OrderCard key={order.id} order={order} />)}
    </div>
  );
}