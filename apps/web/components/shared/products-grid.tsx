// File: apps/web/components/shared/products-grid.tsx
// Reusable products grid with infinite scroll

"use client";

import { useEffect, useRef, useCallback } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { ProductCardCompact, ProductCardCompactSkeleton } from "@/components/product/product-card-compact";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import type { Product } from "@/types/api";

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  totalCount: number;
  onLoadMore: () => void;
  onRetry: () => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function ProductsGrid({
  products,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  totalCount,
  onLoadMore,
  onRetry,
  emptyMessage = "No products found",
  emptyDescription = "Try adjusting your filters",
}: ProductsGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        onLoadMore();
      }
    },
    [onLoadMore, hasNextPage, isFetchingNextPage]
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

  // Error State
  if (isError) {
    return (
      <ErrorState
        title="Failed to load products"
        onRetry={onRetry}
      />
    );
  }

  // Empty State
  if (!isLoading && products.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyMessage}
        description={emptyDescription}
        size="lg"
      />
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardCompactSkeleton key={i} />
            ))
          : products.map((product, i) => (
              <ProductCardCompact key={product.id} product={product} index={i} />
            ))}
      </div>

      {/* Loading More */}
      {isFetchingNextPage && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-[#E9E1D2]" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-[#6B665D] font-medium">
            Loading more products...
          </p>
        </div>
      )}

      {/* Load More Trigger */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-4" />
      )}

      {/* All Caught Up */}
      {!hasNextPage && !isLoading && products.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-14 h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#0A0A0A]">
              You&apos;re all caught up!
            </p>
            <p className="text-xs text-[#6B665D] mt-1">
              Showing all {products.length} products
            </p>
          </div>
        </div>
      )}
    </>
  );
}