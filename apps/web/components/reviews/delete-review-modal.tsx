// File: apps/web/components/reviews/delete-review-modal.tsx
// Confirmation modal for deleting review

"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/api";

interface DeleteReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteReviewModal({
  review,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteReviewModalProps) {
  const [mounted, setMounted] = useState(false);

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

  if (!isOpen || !mounted || !review) return null;

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-w-md w-full pointer-events-auto animate-slide-up sm:animate-scale-in">
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Close (desktop) */}
          <button
            onClick={onClose}
            className="hidden sm:flex absolute top-4 right-4 p-1.5 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-stone-500" />
          </button>

          <div className="p-6 pt-4 sm:pt-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-stone-900 text-center mb-2">
              Delete Review?
            </h2>
            <p className="text-sm text-stone-600 text-center mb-6">
              This action cannot be undone. Your review will be permanently removed.
            </p>

            <div className="flex flex-row-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="sm:hidden h-4" />
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}