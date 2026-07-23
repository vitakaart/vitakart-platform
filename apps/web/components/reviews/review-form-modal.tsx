// File: apps/web/components/reviews/review-form-modal.tsx
// Modal for adding/editing review

"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "./star-rating";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/api";

// ==========================================
// VALIDATION SCHEMA
// ==========================================
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().max(200, "Title too long").optional().or(z.literal("")),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review cannot exceed 2000 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormModalProps {
  isOpen: boolean;
  existingReview?: Review | null;  // If provided → edit mode
  productName?: string;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
  isSubmitting?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export function ReviewFormModal({
  isOpen,
  existingReview,
  productName,
  onClose,
  onSubmit,
  isSubmitting,
}: ReviewFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEditMode = !!existingReview;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
    },
  });

  // Populate on edit
  useEffect(() => {
    if (existingReview) {
      reset({
        rating: existingReview.rating,
        title: existingReview.title ?? "",
        comment: existingReview.comment,
      });
    } else {
      reset({ rating: 0, title: "", comment: "" });
    }
  }, [existingReview, reset, isOpen]);

  const selectedRating = watch("rating");
  const commentValue = watch("comment") || "";

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col pointer-events-auto animate-slide-up sm:animate-scale-in">
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-stone-100 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                {isEditMode ? "Edit Your Review" : "Write a Review"}
              </h2>
              {productName && (
                <p className="text-sm text-stone-500 mt-0.5 truncate">
                  {productName}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors shrink-0"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-5 overflow-y-auto flex-1 space-y-5"
          >
            {/* Rating */}
            <div>
              <label className="text-sm font-semibold text-stone-700 block mb-3">
                Your Rating <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-xl">
                <StarRating
                  rating={selectedRating}
                  size="xl"
                  onChange={(rating) => setValue("rating", rating, { shouldValidate: true })}
                />
                <p
                  className={cn(
                    "text-sm font-semibold min-h-[20px]",
                    selectedRating > 0 ? "text-primary-600" : "text-stone-400"
                  )}
                >
                  {selectedRating > 0 ? RATING_LABELS[selectedRating] : "Tap to rate"}
                </p>
              </div>

              {errors.rating && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.rating.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-700 block">
                Review Title{" "}
                <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <Input
                {...register("title")}
                placeholder="Sum up your experience"
                maxLength={200}
                className={cn(
                  "h-11",
                  errors.title && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.title && (
                <p className="text-xs text-red-500">⚠ {errors.title.message}</p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-700 block">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("comment")}
                rows={5}
                maxLength={2000}
                placeholder="What did you like or dislike? How did the product perform?"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-stone-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all text-sm resize-none",
                  errors.comment && "border-red-500 focus:border-red-500 focus:ring-red-100"
                )}
              />
              <div className="flex items-center justify-between">
                {errors.comment ? (
                  <p className="text-xs text-red-500">
                    ⚠ {errors.comment.message}
                  </p>
                ) : (
                  <p className="text-xs text-stone-500">
                    Minimum 10 characters
                  </p>
                )}
                <p
                  className={cn(
                    "text-xs font-medium",
                    commentValue.length > 1800 ? "text-orange-500" : "text-stone-400"
                  )}
                >
                  {commentValue.length}/2000
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-900 font-semibold mb-1">
                📝 Review Guidelines:
              </p>
              <ul className="text-xs text-blue-800 space-y-0.5 list-disc list-inside">
                <li>Focus on the product and your experience</li>
                <li>Be honest and helpful to other buyers</li>
                <li>Avoid personal information or offensive language</li>
              </ul>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="p-5 border-t border-stone-100 shrink-0">
            <div className="flex flex-row-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex-1 h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Posting..."}
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    {isEditMode ? "Update Review" : "Post Review"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}