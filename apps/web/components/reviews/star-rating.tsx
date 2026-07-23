// File: apps/web/components/reviews/star-rating.tsx
// Reusable star rating component — display + interactive

"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;                          // Current rating (0-5)
  onChange?: (rating: number) => void;     // If provided, becomes interactive
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showValue?: boolean;                     // Show numeric value
  count?: number;                          // Show review count
  readOnly?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { icon: 10, text: "text-[10px]" },
  sm: { icon: 12, text: "text-xs" },
  md: { icon: 16, text: "text-sm" },
  lg: { icon: 20, text: "text-base" },
  xl: { icon: 32, text: "text-xl" },
};

export function StarRating({
  rating,
  onChange,
  size = "md",
  showValue = false,
  count,
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const isInteractive = !!onChange && !readOnly;
  const sizes = SIZE_MAP[size];

  // For display: use rating; for interactive: use hovered or rating
  const displayRating = hoveredStar !== null ? hoveredStar : rating;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div
        className={cn("flex items-center gap-0.5", isInteractive && "cursor-pointer")}
        onMouseLeave={() => setHoveredStar(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isHalfFilled = !isFilled && star - 0.5 <= displayRating;

          return (
            <button
              key={star}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange?.(star)}
              onMouseEnter={() => isInteractive && setHoveredStar(star)}
              className={cn(
                "transition-transform",
                isInteractive && "hover:scale-110 active:scale-95"
              )}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <Star
                size={sizes.icon}
                className={cn(
                  "transition-colors",
                  isFilled
                    ? "text-yellow-500 fill-yellow-500"
                    : isHalfFilled
                      ? "text-yellow-500 fill-yellow-500/50"
                      : "text-stone-300 fill-transparent"
                )}
              />
            </button>
          );
        })}
      </div>

      {showValue && rating > 0 && (
        <span className={cn("font-semibold text-stone-700 ml-1", sizes.text)}>
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && count > 0 && (
        <span className={cn("text-stone-500 ml-1", sizes.text)}>
          ({count.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
}