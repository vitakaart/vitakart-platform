// File: apps/web/components/coupons/coupons-modal.tsx
// Modal showing all available coupons

"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Loader2, Tag, X } from "lucide-react";
import { CouponCard } from "./coupon-card";
import { useActiveCoupons } from "@/lib/hooks/use-coupons";

interface CouponsModalProps {
  isOpen: boolean;
  appliedCode?: string | null;
  onClose: () => void;
  onApply: (code: string) => void;
  isApplying?: boolean;
}

export function CouponsModal({
  isOpen,
  appliedCode,
  onClose,
  onApply,
  isApplying,
}: CouponsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data: coupons, isLoading, isError } = useActiveCoupons();

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

  const handleApply = (code: string) => {
    onApply(code);
    // Close modal after successful apply (via toast success)
    setTimeout(() => onClose(), 500);
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
        <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col pointer-events-auto animate-slide-up sm:animate-scale-in">
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md shadow-orange-200">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Available Coupons
                </h2>
                <p className="text-xs text-stone-500">
                  {coupons?.length ?? 0} offer{coupons?.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState />
            ) : !coupons || coupons.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    isApplied={appliedCode === coupon.code}
                    onApply={handleApply}
                    isApplying={isApplying}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-100 shrink-0 bg-stone-50/50">
            <p className="text-[10px] text-stone-500 text-center">
              💡 Terms & conditions apply. Only one coupon per order.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

// ==========================================
// LOADING STATE
// ==========================================
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      <p className="text-sm text-stone-500">Loading coupons...</p>
    </div>
  );
}

// ==========================================
// ERROR STATE
// ==========================================
function ErrorState() {
  return (
    <div className="text-center py-12">
      <p className="text-sm text-red-600 mb-2">Failed to load coupons</p>
      <p className="text-xs text-stone-500">Please try again later</p>
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-3">
        <Tag className="w-8 h-8 text-stone-400" />
      </div>
      <h3 className="text-base font-bold text-stone-900 mb-1">
        No coupons available
      </h3>
      <p className="text-xs text-stone-500 max-w-xs mx-auto">
        Check back later for exciting offers and discounts
      </p>
    </div>
  );
}