// apps/web/components/reviews/reviews-list.tsx
"use client";

import { Loader2 } from "lucide-react";
import { ReviewCard } from "./review-card";
import type { Review } from "@/types/api";

interface ReviewsListProps {
  reviews: Review[];
  hasNextPage: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
}

export function ReviewsList({
  reviews,
  hasNextPage,
  isFetchingMore,
  onLoadMore,
  onEdit,
  onDelete,
}: ReviewsListProps) {
  if (reviews.length === 0) return null;

  return (
    <div >
      {/* Reviews — divided by borders (no gaps) */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 pt-4 ">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Load more */}
      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Show more reviews"
            )}
          </button>
        </div>
      )}
    </div>
  );
}