// File: apps/web/components/home/best-sellers.tsx
// Clean version using reusable components

"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";

export function BestSellers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => productsApi.getFeatured(6),
    staleTime: 5 * 60 * 1000,
  });

  const products = data ?? [];

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        tag="Top Picks"
        title="Best sellers"
        subtitle="Small compact cards designed for speed and scanability."
        href={ROUTES.PRODUCTS}
      />

      {/* States */}
      {error && <ErrorState onRetry={() => refetch()} />}
      
      {!error && !isLoading && products.length === 0 && (
        <EmptyState
          title="No featured products yet"
          description="Check back soon!"
        />
      )}

      {/* Products */}
      {!error && (isLoading || products.length > 0) && (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      )}
    </section>
  );
}