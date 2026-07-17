// File: apps/web/components/product-detail/related-products.tsx
// Related products carousel (Complete Your Wellness Routine)

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardCompact, ProductCardCompactSkeleton } from "@/components/product/product-card-compact";
import { EmptyState } from "@/components/shared/empty-state";
import type { Product } from "@/types/api";

interface RelatedProductsProps {
  products: Product[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export function RelatedProducts({
  products,
  isLoading = false,
  title = "Complete Your Wellness Routine",
  subtitle = "Curated picks that pair perfectly with your selection",
}: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#0A0A0A]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#6B665D] mt-1 hidden md:block">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation Arrows (desktop only) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E9E1D2] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E9E1D2] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <EmptyState
          title="No related products yet"
          description="Check back later for more recommendations"
        />
      )}

      {/* Products Scroll */}
      {(isLoading || products.length > 0) && (
        <div
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[180px] md:w-[220px]">
                  <ProductCardCompactSkeleton />
                </div>
              ))
            : products.map((product, i) => (
                <div key={product.id} className="flex-shrink-0 w-[180px] md:w-[220px]">
                  <ProductCardCompact product={product} index={i} />
                </div>
              ))}
        </div>
      )}
    </div>
  );
}