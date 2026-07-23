// apps/web/components/reviews/review-eligibility-banner.tsx
"use client";

import { Info } from "lucide-react";

interface ReviewEligibilityBannerProps {
  reason?: string;
}

export function ReviewEligibilityBanner({
  reason,
}: ReviewEligibilityBannerProps) {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
      <p className="text-xs leading-relaxed text-slate-600">
        <span className="font-semibold text-slate-900">
          Verified reviews only.
        </span>{" "}
        {reason || "Purchase this product to leave a review."}
      </p>
    </div>
  );
}