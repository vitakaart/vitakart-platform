// File: apps/web/components/coupons/coupon-input.tsx
// Manual coupon code input

"use client";

import { useState } from "react";
import { Tag, Loader2, X, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CouponInputProps {
  appliedCode?: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  onOpenCouponsList?: () => void;
  isApplying?: boolean;
  isRemoving?: boolean;
  disabled?: boolean;
}

export function CouponInput({
  appliedCode,
  onApply,
  onRemove,
  onOpenCouponsList,
  isApplying,
  isRemoving,
  disabled,
}: CouponInputProps) {
  const [code, setCode] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;
    onApply(code.trim().toUpperCase());
    setCode("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  // ==========================================
  // APPLIED STATE (Coupon already applied)
  // ==========================================
  if (appliedCode) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-emerald-900">
                Coupon Applied
              </p>
              <Sparkles className="w-3 h-3 text-emerald-600" />
            </div>
            <p className="text-sm font-black text-emerald-700 tracking-wider truncate">
              {appliedCode}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            disabled={isRemoving}
            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Remove coupon"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            ) : (
              <X className="w-4 h-4 text-emerald-700" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // INPUT STATE (No coupon)
  // ==========================================
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Enter coupon code"
            disabled={disabled || isApplying}
            className={cn(
              "w-full h-10 pl-10 pr-3 rounded-lg border-2 border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all text-sm font-semibold uppercase tracking-wider",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={!code.trim() || isApplying || disabled}
          className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0"
        >
          {isApplying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      </div>

      {/* View available coupons link */}
      {onOpenCouponsList && (
        <button
          type="button"
          onClick={onOpenCouponsList}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Tag className="w-3 h-3" />
          View available coupons
        </button>
      )}
    </div>
  );
}