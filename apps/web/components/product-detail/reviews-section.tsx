// apps/web/components/product-detail/reviews-section.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RatingBreakdown } from "@/components/reviews/rating-breakdown";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { ReviewFormModal } from "@/components/reviews/review-form-modal";
import { DeleteReviewModal } from "@/components/reviews/delete-review-modal";
import { ReviewEmptyState } from "@/components/reviews/review-empty-state";
import { ReviewEligibilityBanner } from "@/components/reviews/review-eligibility-banner";
import { ReviewHeader } from "@/components/reviews/review-header";
import {
  useProductReviews,
  useReviewEligibility,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/lib/hooks/use-reviews";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";
import type { Review } from "@/types/api";

interface ReviewsSectionProps {
  productId: string;
  productName: string;
}

export function ReviewsSection({
  productId,
  productName,
}: ReviewsSectionProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [page, setPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  const { data, isLoading, isError, refetch } = useProductReviews(productId, {
    page,
    pageSize: 10,
    rating: filterRating ?? undefined,
  });

  const { data: eligibility } = useReviewEligibility(productId);
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${window.location.pathname}`);
      return;
    }
    if (eligibility?.hasReviewed && eligibility.existingReview) {
      setEditingReview(eligibility.existingReview);
    } else {
      setEditingReview(null);
    }
    setFormModalOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setEditingReview(null);
  };

  const handleSubmitReview = (data: {
    rating: number;
    title?: string;
    comment: string;
  }) => {
    if (editingReview) {
      updateMutation.mutate(
        {
          id: editingReview.id,
          data: {
            rating: data.rating,
            title: data.title || undefined,
            comment: data.comment,
          },
        },
        { onSuccess: () => handleCloseForm() }
      );
    } else {
      createMutation.mutate(
        {
          productId,
          rating: data.rating,
          title: data.title || undefined,
          comment: data.comment,
        },
        { onSuccess: () => handleCloseForm() }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingReview) return;
    deleteMutation.mutate(deletingReview.id, {
      onSuccess: () => setDeletingReview(null),
    });
  };

  const handleFilterRating = (rating: number) => {
    setFilterRating(rating === 0 ? null : rating);
    setPage(1);
  };

  const stats = data?.stats;
  const reviews = data?.reviews ?? [];
  const totalCount = data?.totalCount ?? 0;
  const hasNextPage = data?.hasNextPage ?? false;
  const hasStats = stats && stats.totalReviews > 0;

  const buttonText = !isAuthenticated
    ? "Sign in to review"
    : eligibility?.hasReviewed
      ? "Edit review"
      : eligibility?.hasPurchased
        ? "Write a review"
        : "Purchase to review";

  const shortButtonText = eligibility?.hasReviewed ? "Edit" : "Write";
  const canClickButton =
    !isAuthenticated || eligibility?.canReview || eligibility?.hasReviewed;

  return (
    <section>
      {/* Header */}
      <ReviewHeader
        totalReviews={stats?.totalReviews ?? 0}
        averageRating={stats?.averageRating ?? 0}
        buttonText={buttonText}
        shortButtonText={shortButtonText}
        canClickButton={canClickButton ?? false}
        isAuthenticated={isAuthenticated}
        onWriteReview={handleWriteReview}
      />

      {/* Eligibility banner */}
      {isAuthenticated &&
        eligibility &&
        !eligibility.canReview &&
        !eligibility.hasReviewed && (
          <ReviewEligibilityBanner reason={eligibility.reason} />
        )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading reviews
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="mb-3 text-sm text-red-700">Failed to load reviews</p>
          <button
            onClick={() => refetch()}
            className="rounded-md border border-red-300 bg-white px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* Main */}
      {!isLoading && !isError && (
        <>
          {stats?.totalReviews === 0 && (
            <ReviewEmptyState
              canWrite={eligibility?.canReview ?? false}
              onWrite={handleWriteReview}
            />
          )}

          {hasStats && (
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              {/* Left: Rating breakdown (sticky) */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <RatingBreakdown
                  stats={stats}
                  onRatingClick={handleFilterRating}
                  activeRating={filterRating}
                />
              </aside>

              {/* Right: Reviews */}
              <div className="min-w-0">
                {/* Filter status */}
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {filterRating ? (
                      <>
                        Showing{" "}
                        <span className="font-semibold text-slate-900">
                          {filterRating}-star
                        </span>{" "}
                        reviews · {totalCount}
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-slate-900">
                          {totalCount}
                        </span>{" "}
                        {totalCount === 1 ? "review" : "reviews"}
                      </>
                    )}
                  </p>

                  {filterRating && (
                    <button
                      onClick={() => handleFilterRating(0)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                    >
                      Show all
                    </button>
                  )}
                </div>

                {/* No filtered results */}
                {totalCount === 0 && filterRating !== null && (
                  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
                    <p className="text-sm font-semibold text-slate-900">
                      No {filterRating}-star reviews
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try a different rating filter
                    </p>
                    <button
                      onClick={() => handleFilterRating(0)}
                      className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Show all reviews
                    </button>
                  </div>
                )}

                {reviews.length > 0 && (
                  <ReviewsList
                    reviews={reviews}
                    hasNextPage={hasNextPage}
                    isFetchingMore={isLoading}
                    onLoadMore={() => setPage((p) => p + 1)}
                    onEdit={handleEditReview}
                    onDelete={setDeletingReview}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ReviewFormModal
        isOpen={formModalOpen}
        existingReview={editingReview}
        productName={productName}
        onClose={handleCloseForm}
        onSubmit={handleSubmitReview}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteReviewModal
        review={deletingReview}
        isOpen={!!deletingReview}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </section>
  );
}