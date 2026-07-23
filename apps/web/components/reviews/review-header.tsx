// apps/web/components/reviews/review-header.tsx
"use client";

import { PenLine, Star } from "lucide-react";

interface ReviewHeaderProps {
  totalReviews: number;
  averageRating: number;
  buttonText: string;
  shortButtonText: string;
  canClickButton: boolean;
  isAuthenticated: boolean;
  onWriteReview: () => void;
}

export function ReviewHeader({
  totalReviews,
  averageRating,
  buttonText,
  shortButtonText,
  canClickButton,
  isAuthenticated,
  onWriteReview,
}: ReviewHeaderProps) {
  const hasReviews = totalReviews > 0;

  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
      <div className="min-w-0 flex-1">
        
        <h2 className="text-lg font-bold text-[#0A0A0A] flex gap-1 items-center">
            <span>  Reviews</span>
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      
        </h2>

        {hasReviews && (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-900">
              {averageRating.toFixed(1)}
            </span>
            <span>·</span>
            <span>
              {totalReviews.toLocaleString("en-IN")} {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onWriteReview}
        disabled={isAuthenticated && !canClickButton}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-black/40 px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <PenLine className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{buttonText}</span>
        <span className="sm:hidden">{shortButtonText}</span>
      </button>
    </div>
  );
}