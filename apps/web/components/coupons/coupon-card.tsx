// apps/web/components/coupons/coupon-card.tsx
"use client";

import { useState } from "react";
import { Check, Copy, Clock, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Coupon } from "@/types/api";

interface CouponCardProps {
  coupon: Coupon;
  isApplied?: boolean;
  onApply: (code: string) => void;
  isApplying?: boolean;
  disabled?: boolean;
}

export function CouponCard({
  coupon,
  isApplied,
  onApply,
  isApplying,
  disabled,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const isAlreadyUsed = !coupon.canUseAgain;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlreadyUsed) {
      toast.error("You have already used this coupon");
      return;
    }
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success("Code copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const discountLabel =
    coupon.type === "Percentage"
      ? `${coupon.value.toFixed(0)}%`
      : `₹${coupon.value.toFixed(0)}`;

  const daysLeft = coupon.validUntil
    ? Math.ceil(
      (new Date(coupon.validUntil).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : null;

  const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft > 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white transition-all",
        isApplied &&
        "border-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_4px_16px_rgba(16,185,129,0.08)]",
        isAlreadyUsed && !isApplied && "border-slate-200 opacity-60",
        !isApplied &&
        !isAlreadyUsed &&
        "border-orange-100 hover:border-orange-200 hover:shadow-[0_2px_12px_rgba(251,146,60,0.08)]"
      )}
    >
      {/* Top status bar */}
      {(isApplied || isAlreadyUsed) && (
        <div
          className={cn(
            "flex items-center justify-center gap-1 py-1 text-[9px] font-bold uppercase tracking-widest",
            isApplied
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          )}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="h-2.5 w-2.5" strokeWidth={3} />
              Applied
            </>
          ) : (
            <>
              <CheckCircle2 className="h-2.5 w-2.5" strokeWidth={3} />
              Already Redeemed
            </>
          )}
        </div>
      )}

      <div className="flex">
        {/* ═══════════════════════════════════
            LEFT — Discount block
        ═══════════════════════════════════ */}
        <div
          className={cn(
            "relative flex min-w-[88px] flex-col items-center justify-center gap-0.5 px-3 py-3.5",
            isApplied
              ? "bg-emerald-50"
              : isAlreadyUsed
                ? "bg-slate-50"
                : "bg-gradient-to-br from-orange-50 to-red-50"
          )}
        >
          {/* Perforated edge */}
          <div className="absolute -right-[6px] top-0 flex h-full flex-col justify-between py-0.5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full border border-slate-200 bg-white"
              />
            ))}
          </div>

          {/* Discount value */}
          <div
            className={cn(
              "text-2xl font-bold leading-none tracking-tight",
              isApplied
                ? "text-emerald-700"
                : isAlreadyUsed
                  ? "text-slate-400"
                  : "text-orange-600"
            )}
          >
            {discountLabel}
          </div>

          <div
            className={cn(
              "text-[9px] font-bold uppercase tracking-widest",
              isApplied
                ? "text-emerald-600"
                : isAlreadyUsed
                  ? "text-slate-400"
                  : "text-orange-500"
            )}
          >
            OFF
          </div>

          {/* Type badge */}
          <div
            className={cn(
              "mt-0.5 rounded-full border px-1.5 py-0.5 text-[8px] font-semibold",
              isApplied
                ? "border-emerald-200 bg-white text-emerald-700"
                : isAlreadyUsed
                  ? "border-slate-200 bg-white text-slate-400"
                  : "border-orange-200 bg-white text-orange-600"
            )}
          >
            {coupon.type === "Percentage" ? "Percent" : "Flat"}
          </div>
        </div>

        {/* Dashed divider */}
        <div className="relative w-px">
          <div className="absolute inset-y-2 left-0 w-px border-l border-dashed border-slate-200" />
        </div>

        {/* ═══════════════════════════════════
            RIGHT — Details
        ═══════════════════════════════════ */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
          {/* Code row */}
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex flex-1 items-center gap-1.5 rounded-md border border-dashed px-2 py-1",
                isAlreadyUsed
                  ? "border-slate-200 bg-slate-50"
                  : "border-orange-200 bg-orange-50/50"
              )}
            >
              <code
                className={cn(
                  "flex-1 truncate text-xs font-bold tracking-wider tabular-nums",
                  isAlreadyUsed
                    ? "text-slate-400 line-through"
                    : "text-slate-900"
                )}
              >
                {coupon.code}
              </code>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleCopy}
              disabled={isAlreadyUsed}
              aria-label="Copy code"
              className={cn(
                isAlreadyUsed && "opacity-40",
                !isAlreadyUsed &&
                !copied &&
                "border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700",
                copied &&
                "border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
              )}
            >
              {copied ? (
                <Check className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Description */}
          {coupon.description && (
            <p
              className={cn(
                "line-clamp-1 text-[11px] leading-snug",
                isAlreadyUsed ? "text-slate-400" : "text-slate-600"
              )}
            >
              {coupon.description}
            </p>
          )}

          {/* Conditions */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px]">
            {coupon.minOrderAmount > 0 && (
              <span
                className={cn(
                  "font-medium",
                  isAlreadyUsed ? "text-slate-400" : "text-slate-600"
                )}
              >
                Min ₹{coupon.minOrderAmount.toLocaleString("en-IN")}
              </span>
            )}

            {coupon.maxDiscount && coupon.type === "Percentage" && (
              <>
                {coupon.minOrderAmount > 0 && (
                  <span className="text-slate-300">·</span>
                )}
                <span
                  className={cn(
                    "font-medium",
                    isAlreadyUsed ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  Max ₹{coupon.maxDiscount.toLocaleString("en-IN")}
                </span>
              </>
            )}

            {coupon.validUntil && !isAlreadyUsed && (
              <>
                <span className="text-slate-300">·</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-semibold",
                    isExpiringSoon ? "text-orange-600" : "text-slate-600"
                  )}
                >
                  <Clock className="h-2 w-2" strokeWidth={2.5} />
                  {isExpiringSoon
                    ? `${daysLeft}d left`
                    : new Date(coupon.validUntil).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                </span>
              </>
            )}
          </div>

          {/* Usage info */}
          {coupon.isUsedByUser && coupon.canUseAgain && (
            <div className="flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50/60 px-2 py-1">
              <Info className="h-2.5 w-2.5 shrink-0 text-blue-600" />
              <p className="text-[10px] leading-tight text-blue-800">
                Used <span className="font-bold">{coupon.userUsageCount}</span>
                {coupon.perUserLimit && (
                  <>
                    {" "}
                    of <span className="font-bold">{coupon.perUserLimit}</span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Apply Button */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onApply(coupon.code)}
            disabled={disabled || isApplying || isApplied || isAlreadyUsed}
            className={cn(
              "w-full font-semibold",
              isApplied &&
              "cursor-default border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
              isAlreadyUsed &&
              "cursor-not-allowed text-slate-400",
              !isApplied &&
              !isAlreadyUsed &&
              "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
            )}
          >
            {isApplied ? (
              <>
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Applied
              </>
            ) : isAlreadyUsed ? (
              <>
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                Already Used
              </>
            ) : isApplying ? (
              "Applying..."
            ) : (
              "Apply Coupon"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}