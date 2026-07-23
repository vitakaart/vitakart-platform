// File: apps/web/components/cart/clear-cart-modal.tsx
// Confirmation modal — bottom sheet on mobile, center on desktop

"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClearCartModalProps {
  isOpen: boolean;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
  isClearing?: boolean;
}

export function ClearCartModal({
  isOpen,
  itemCount,
  onClose,
  onConfirm,
  isClearing,
}: ClearCartModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when open
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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-w-md w-full pointer-events-auto animate-slide-up sm:animate-scale-in">
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Close button (desktop) */}
          <button
            onClick={onClose}
            className="hidden sm:flex absolute top-4 right-4 p-1.5 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-stone-500" />
          </button>

          {/* Content */}
          <div className="p-6 pt-4 sm:pt-6">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-stone-900 text-center mb-2">
              Clear all?
            </h2>

            {/* Description */}
            <p className="text-sm text-stone-600 text-center mb-6">
              This will remove all{" "}
              <span className="font-bold text-stone-900">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>{" "}
              from your cart. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex flex-row-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isClearing}
                className="flex-1 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isClearing}
                 className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear all
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Safe area for mobile */}
          <div className="sm:hidden h-4" />
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}