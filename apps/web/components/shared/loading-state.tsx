// File: apps/web/components/shared/loading-state.tsx
// Reusable loading skeleton variations

import { cn } from "@/lib/utils";

// Skeleton box (basic building block)
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-[#F5F1E8] rounded animate-pulse", className)} />
  );
}

// Product card skeleton (small)
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-3 animate-pulse",
        className
      )}
    >
      <div className="h-24 rounded-xl bg-[#F5F1E8]" />
      <div className="mt-2 h-3 w-20 rounded bg-[#F5F1E8]" />
      <div className="mt-2 h-4 w-32 rounded bg-[#F5F1E8]" />
      <div className="mt-2 h-3 w-16 rounded bg-[#F5F1E8]" />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-5 w-14 rounded bg-[#F5F1E8]" />
        <div className="h-8 w-12 rounded-lg bg-[#F5F1E8]" />
      </div>
    </div>
  );
}

// Category card skeleton
export function CategorySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#FFFDF8] border border-[#E9E1D2] p-4 animate-pulse",
        className
      )}
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5F1E8] mb-3" />
      <div className="h-3 w-3/4 mx-auto rounded bg-[#F5F1E8] mb-1" />
      <div className="h-2 w-1/2 mx-auto rounded bg-[#F5F1E8]" />
    </div>
  );
}

// Feature card skeleton
export function FeatureCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#F5F1E8] p-5 h-40 animate-pulse",
        className
      )}
    />
  );
}

// Grid of skeletons
export function SkeletonGrid({
  count = 4,
  type = "card",
  className,
}: {
  count?: number;
  type?: "card" | "category" | "feature";
  className?: string;
}) {
  const Component = {
    card: CardSkeleton,
    category: CategorySkeleton,
    feature: FeatureCardSkeleton,
  }[type];

  return (
    <div className={cn("grid gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}