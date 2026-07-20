"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { OrderStatus } from "@/types/api";
import { DATE_FILTERS, DateFilterId } from "./date-filter-types";

const PAGE_SIZE = 10;

interface Params {
  statusFilter: OrderStatus | null;
  dateFilter: DateFilterId;
}

export function useInfiniteOrders({ statusFilter, dateFilter }: Params) {
  const { isAuthenticated } = useAuthStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get date range from filter id
  const dateRange = useMemo(() => {
    const filter = DATE_FILTERS.find((f) => f.id === dateFilter);
    return filter ? filter.getRange() : {};
  }, [dateFilter]);

  const query = useInfiniteQuery({
    queryKey: ["orders-infinite", statusFilter, dateFilter],
    queryFn: ({ pageParam = 1 }) =>
      ordersApi.getMyOrders({
        page: pageParam,
        pageSize: PAGE_SIZE,
        status: statusFilter ?? undefined,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage < lastPage.totalPages ? currentPage + 1 : undefined;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const orders = useMemo(
    () => query.data?.pages.flatMap((p) => p.orders) ?? [],
    [query.data]
  );

  const totalCount = query.data?.pages[0]?.totalCount ?? 0;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
    [query]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return {
    orders,
    totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    refetch: query.refetch,
    loadMoreRef,
  };
}