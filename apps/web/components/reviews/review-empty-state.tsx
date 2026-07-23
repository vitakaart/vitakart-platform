// apps/web/components/reviews/review-empty-state.tsx
"use client";

import { PenLine } from "lucide-react";
import { StarRating } from "./star-rating";

interface ReviewEmptyStateProps {
  canWrite: boolean;
  onWrite: () => void;
}

export function ReviewEmptyState({ canWrite, onWrite }: ReviewEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex opacity-50">
        <StarRating rating={0} size="md" readOnly />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        No reviews yet
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
        {canWrite
          ? "Be the first to share your experience with this product."
          : "Purchase this product to be the first to review it."}
      </p>

      {canWrite && (
        <button
          onClick={onWrite}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <PenLine className="h-4 w-4" />
          Write a review
        </button>
      )}
    </div>
  );
}