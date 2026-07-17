// File: apps/web/components/product-detail/review-card.tsx
// Individual review card

import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  userInitials: string;
  isVerified: boolean;
  rating: number;
  timeAgo: string;
  comment: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-4 md:p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5F1E8] flex items-center justify-center font-bold text-[#0A0A0A] text-sm flex-shrink-0">
            {review.userInitials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#0A0A0A]">
                {review.userName}
              </span>
              {review.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              )}
            </div>
            <div className="text-xs text-[#6B665D]">
              {review.isVerified && "Verified Buyer • "}
              {review.timeAgo}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-0.5 text-yellow-500 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= review.rating ? "fill-current" : "fill-none"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-[#0A0A0A] leading-6 mb-3">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Review Image */}
      {review.hasImage && review.imageUrl && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden mt-3">
          <Image
            src={review.imageUrl}
            alt="Review"
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}
    </div>
  );
}