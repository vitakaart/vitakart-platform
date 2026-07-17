// File: apps/web/components/product-detail/reviews-section.tsx
// Complete reviews section with breakdown and cards

"use client";

import { RatingBreakdown } from "./rating-breakdown";
import { ReviewCard } from "./review-card";

// Static reviews for now (backend baad mein)
const REVIEWS = [
  {
    id: "1",
    userName: "Rahul Kapoor",
    userInitials: "RK",
    isVerified: true,
    rating: 5,
    timeAgo: "2 days ago",
    comment:
      "Excellent quality. I've tried many Vitamin C supplements, but the organic sourcing here really makes a difference. No acidity or stomach issues. Feeling much more energetic.",
    hasImage: true,
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    userName: "Sanya Malhotra",
    userInitials: "SM",
    isVerified: true,
    rating: 4,
    timeAgo: "1 week ago",
    comment:
      "The taste is quite pleasant and natural. It's become a staple in my morning routine. Delivery was super fast as promised.",
    hasImage: false,
  },
];

export function ReviewsSection() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#0A0A0A]">
            Community Voices
          </h3>
          <p className="text-sm text-[#6B665D] mt-1">
            Real experiences from our wellness tribe.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 h-10 px-4 rounded-full border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white text-sm font-bold transition-all">
          Write a Review
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-[280px_1fr] gap-4 md:gap-6">
        {/* Rating Breakdown */}
        <div>
          <RatingBreakdown
            averageRating={4.8}
            totalReviews={1240}
            breakdown={{
              5: 75,
              4: 15,
              3: 5,
              2: 3,
              1: 2,
            }}
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* View All Button */}
          <button className="w-full h-11 rounded-full border border-[#E9E1D2] text-sm font-semibold text-[#0A0A0A] hover:border-[#10B981] hover:text-[#10B981] transition-all">
            View All 1,240 Reviews
          </button>
        </div>
      </div>
    </div>
  );
}