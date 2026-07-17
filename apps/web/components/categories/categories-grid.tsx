// File: apps/web/components/categories/categories-grid.tsx
// Reusable grid for category cards with loading & empty states

import { CategoryCard } from "./category-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { CategorySkeleton } from "@/components/shared/loading-state";
import type { Category } from "@/types/api";

interface CategoriesGridProps {
  categories: Category[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  showProductCount?: boolean;
  skeletonCount?: number;
}

export function CategoriesGrid({
  categories,
  isLoading = false,
  isError = false,
  onRetry,
  showProductCount = true,
  skeletonCount = 8,
}: CategoriesGridProps) {
  // Error State
  if (isError) {
    return (
      <ErrorState
        title="Failed to load categories"
        onRetry={onRetry}
      />
    );
  }

  // Empty State
  if (!isLoading && categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Categories will appear here soon"
        size="lg"
      />
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))
        : categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              showProductCount={showProductCount}
            />
          ))}
    </div>
  );
}