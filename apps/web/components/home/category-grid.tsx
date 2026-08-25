// File: apps/web/components/home/category-grid.tsx
// Backend-connected category grid with SectionHeader

"use client";

import { Grid2X2 } from "lucide-react";
import { CategoryCard } from "@/components/categories/category-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SectionHeader } from "@/components/shared/section-header";
import { useTopLevelCategories } from "@/lib/hooks/use-categories";
import { ROUTES } from "@/lib/constants/routes";

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center text-center animate-pulse">
      <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#E9E1D2]/50 bg-[#FFFDF8] shadow-[0_8px_20px_rgba(212,197,169,0.3)] sm:h-24 sm:w-24">
        <div className="h-12 w-12 rounded-full bg-[#E9E1D2] sm:h-14 sm:w-14" />
      </div>
      <div className="mb-1 h-3 w-16 rounded bg-[#E9E1D2]" />
      <div className="h-2.5 w-12 rounded bg-[#E9E1D2]" />
    </div>
  );
}

export function CategoryGrid() {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useTopLevelCategories();

  const displayedCategories = categories?.slice(0, 8) ?? [];

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <SectionHeader
        tag="Shop Smart"
        title="Shop by category"
        href={ROUTES.CATEGORIES}
        arrowLabel="View all categories"
      />

      {/* Error */}
      {isError && (
        <ErrorState
          title="Categories load nahi hui"
          description="Please thoda baad dobara try karo."
          onRetry={() => void refetch()}
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && displayedCategories.length === 0 && (
        <EmptyState
          size="md"
          icon={<Grid2X2 className="mx-auto h-10 w-10 text-[#10B981]" />}
          title="No categories available"
          description="Abhi categories available nahi hain. Check back soon."
        />
      )}

      {/* Loading */}
      {isLoading && !isError && (
        <div className="grid grid-flow-col auto-cols-[104px] justify-items-center gap-4 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar sm:auto-cols-[120px] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-8 lg:overflow-visible">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="snap-start">
              <CategorySkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Data */}
      {!isLoading && !isError && displayedCategories.length > 0 && (
        <div className="grid grid-flow-col auto-cols-[104px] justify-items-center gap-4 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar sm:auto-cols-[120px] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-8 lg:overflow-visible">
          {displayedCategories.map((category) => (
            <div key={category.id} className="snap-start">
              <CategoryCard category={category} showProductCount />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}