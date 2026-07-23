// apps/web/components/reviews/review-card.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Check } from "lucide-react";
import { StarRating } from "./star-rating";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/api";
import { useAuthStore } from "@/lib/stores/auth-store";

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
}

function getAvatarBg(name: string): string {
  const colors = [
    "bg-slate-800",
    "bg-blue-800",
    "bg-emerald-800",
    "bg-amber-800",
    "bg-rose-800",
    "bg-purple-800",
    "bg-teal-800",
    "bg-indigo-800",
  ];
  const hash = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return colors[hash % colors.length];
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const user = useAuthStore((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isOwnReview = user?.id === review.userId;
  const showActions = isOwnReview && (onEdit || onDelete);
  const avatarBg = getAvatarBg(review.userName);
  const timeAgo = formatTimeAgo(review.createdAt);

  const isLongComment = review.comment.length > 240;
  const displayComment =
    expanded || !isLongComment
      ? review.comment
      : review.comment.slice(0, 240) + "…";

  return (
    <article className="border-b border-slate-100 py-5 last:border-b-0 first:pt-0">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Avatar */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
              avatarBg
            )}
          >
            {review.userInitial}
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-slate-900">
                {review.userName}
              </span>
              {isOwnReview && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600">
                  You
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              {review.isVerifiedPurchase && (
                <>
                  <span className="inline-flex items-center gap-0.5 font-medium text-emerald-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                    Verified purchase
                  </span>
                  <span className="text-slate-300">·</span>
                </>
              )}
              <span>{timeAgo}</span>
              {review.updatedAt && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="italic">edited</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(review);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(review);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Rating + Title */}
      <div className="mb-2 flex items-center gap-2.5">
        <StarRating rating={review.rating} size="sm" readOnly />
        {review.title && (
          <h4 className="truncate text-sm font-semibold text-slate-900">
            {review.title}
          </h4>
        )}
      </div>

      {/* Comment */}
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-slate-700">
        {displayComment}
        {isLongComment && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="ml-1 font-semibold text-slate-900 hover:underline"
          >
            Read more
          </button>
        )}
      </p>

      {isLongComment && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          Show less
        </button>
      )}
    </article>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}