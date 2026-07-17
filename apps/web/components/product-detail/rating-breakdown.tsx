// File: apps/web/components/product-detail/rating-breakdown.tsx
// Rating breakdown bars (5,4,3,2,1 stars)

import { Star } from "lucide-react";

interface RatingBreakdownProps {
  averageRating?: number;
  totalReviews?: number;
  breakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function RatingBreakdown({
  averageRating = 4.8,
  totalReviews = 1240,
  breakdown = {
    5: 75,
    4: 15,
    3: 5,
    2: 3,
    1: 2,
  },
}: RatingBreakdownProps) {
  return (
    <div className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-5">
      {/* Average Rating */}
      <div className="text-center mb-4">
        <div className="text-4xl font-black text-[#0A0A0A]">{averageRating}</div>
        <div className="flex items-center justify-center gap-0.5 my-2 text-yellow-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(averageRating) ? "fill-current" : "fill-none"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-[#6B665D]">
          Based on {totalReviews.toLocaleString("en-IN")} reviews
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-2">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const percentage = breakdown[star];
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-[#6B665D] font-medium">{star}</span>
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <div className="flex-1 h-1.5 rounded-full bg-[#F5F1E8] overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-[#6B665D]">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}