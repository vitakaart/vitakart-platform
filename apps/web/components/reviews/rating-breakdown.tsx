// apps/web/components/reviews/rating-breakdown.tsx
"use client";

import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductReviewStats } from "@/types/api";

interface RatingBreakdownProps {
  stats: ProductReviewStats;
  onRatingClick?: (rating: number) => void;
  activeRating?: number | null;
}

export function RatingBreakdown({
  stats,
  onRatingClick,
  activeRating,
}: RatingBreakdownProps) {
  const { averageRating, totalReviews, ratingBreakdown, ratingPercentage } =
    stats;

  if (totalReviews === 0) return null;

  const recommendPercent = Math.round(
    (((ratingBreakdown[5] ?? 0) + (ratingBreakdown[4] ?? 0)) / totalReviews) *
      100
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* Score */}
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-baseline gap-2">
          <span className="text-[42px] font-bold leading-none tracking-tight text-slate-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm font-medium text-slate-400">/ 5</span>
        </div>

        {/* Stars */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {totalReviews.toLocaleString("en-IN")} reviews
          </span>
        </div>

        {/* Recommend */}
        {recommendPercent > 0 && (
          <p className="mt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">
              {recommendPercent}%
            </span>{" "}
            of customers recommend this
          </p>
        )}
      </div>

      {/* Distribution */}
      <div className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-900">
            Rating breakdown
          </p>
          {activeRating && onRatingClick && (
            <button
              onClick={() => onRatingClick(0)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingBreakdown[rating] ?? 0;
            const percentage = ratingPercentage[rating] ?? 0;
            const isActive = activeRating === rating;
            const isClickable = !!onRatingClick && count > 0;

            return (
              <button
                key={rating}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onRatingClick?.(rating)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors",
                  isClickable && "hover:bg-slate-50",
                  isActive && "bg-slate-100",
                  !isClickable && "opacity-40"
                )}
              >
                <span className="w-3 text-xs font-semibold text-slate-700">
                  {rating}
                </span>

                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                      isActive ? "bg-slate-900" : "bg-slate-400"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 text-right text-[11px] font-medium tabular-nums text-slate-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}