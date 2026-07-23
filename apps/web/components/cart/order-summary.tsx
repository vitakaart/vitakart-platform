// File: apps/web/components/cart/order-summary.tsx
// Order summary with REAL coupon API integration

"use client";

import {
  Tag,
  Truck,
  ArrowRight,
  Gift,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { CouponSection } from "@/components/coupons/coupon-section";
import type { Cart } from "@/types/api";

interface OrderSummaryProps {
  cart: Cart;
  onCheckout?: () => void;
  compact?: boolean;
  showCoupon?: boolean;  // ← Optional: hide coupon section (if using elsewhere)
}

export function OrderSummary({
  cart,
  onCheckout,
  compact = false,
  showCoupon = true,
}: OrderSummaryProps) {
  const freeShippingThreshold = 999;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const progressPercent = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  // Total savings (product discount + coupon)
  const totalSavings = cart.totalDiscount + cart.couponDiscount;

  return (
    <div
      className={`bg-[#FFFDF8] border border-[#E9E1D2] rounded-2xl ${compact ? "p-4" : "p-5 md:p-6"} shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
          <Gift className="w-4 h-4 text-primary-600" />
        </div>
        <h3
          className={`${compact ? "text-base" : "text-lg"} font-bold text-[#0A0A0A]`}
        >
          Order Summary
        </h3>
      </div>

      {/* Free Shipping Progress */}
      {!compact && cart.subtotal < freeShippingThreshold && cart.shippingFee > 0 && (
        <div className="mb-5 p-3 bg-primary-50/50 border border-primary-100 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-primary-700 font-semibold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Free Shipping Progress
            </span>
            <span className="text-primary-600 font-bold">
              ₹{amountForFreeShipping.toLocaleString("en-IN")} more
            </span>
          </div>
          <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-primary-600 mt-1.5">
            Add ₹{amountForFreeShipping.toLocaleString("en-IN")} more for free shipping
          </p>
        </div>
      )}

      {/* Free Shipping Success */}
      {!compact && cart.shippingFee === 0 && cart.subtotal >= freeShippingThreshold && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-xs font-bold text-green-700">
            🎉 You qualify for FREE shipping!
          </span>
        </div>
      )}

      {/* ✅ COUPON SECTION (Real API) */}
      {!compact && showCoupon && (
        <div className="mb-5">
          <CouponSection appliedCode={cart.couponCode} />
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-[#E9E1D2]">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B665D] flex items-center gap-1.5">
            Subtotal
            <span className="text-[10px] bg-[#F5F1E8] px-1.5 py-0.5 rounded-md text-[#6B665D] font-medium">
              {cart.totalItems} items
            </span>
          </span>
          <span className="font-semibold text-[#0A0A0A]">
            ₹{(cart.subtotal + cart.totalDiscount).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Product Discount */}
        {cart.totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm animate-fade-in">
            <span className="text-[#6B665D] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-500" />
              Product Discount
            </span>
            <span className="font-bold text-primary-600">
              -₹{cart.totalDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* ✅ Coupon Discount */}
        {cart.couponDiscount > 0 && cart.couponCode && (
          <div className="flex items-center justify-between text-sm animate-fade-in">
            <span className="text-[#6B665D] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Coupon{" "}
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {cart.couponCode}
                </span>
              </span>
            </span>
            <span className="font-bold text-emerald-600">
              -₹{cart.couponDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6B665D]">Shipping</span>
            {cart.shippingFee === 0 && cart.subtotal >= freeShippingThreshold && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-md">
                <Truck className="w-3 h-3" />
                FREE
              </span>
            )}
          </div>
          <span className="font-semibold text-[#0A0A0A]">
            {cart.shippingFee === 0 ? (
              <span className="text-primary-600 font-bold">FREE</span>
            ) : (
              `₹${cart.shippingFee.toLocaleString("en-IN")}`
            )}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-[#E9E1D2]">
        <div>
          <span
            className={`${compact ? "text-base" : "text-lg"} font-bold text-[#0A0A0A]`}
          >
            Total
          </span>
          <p className="text-[10px] text-[#6B665D] mt-0.5">
            Including all taxes
          </p>
        </div>
        <div className="text-right">
          <span
            className={`${compact ? "text-xl" : "text-2xl"} font-black text-[#0A0A0A] tabular-nums`}
          >
            ₹{cart.total.toLocaleString("en-IN")}
          </span>
          {totalSavings > 0 && (
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              You saved ₹{totalSavings.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>

      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-primary-50 border border-emerald-200 rounded-xl text-center animate-fade-in">
          <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1.5">
            <span className="text-lg">🎉</span>
            You&apos;re saving ₹{totalSavings.toLocaleString("en-IN")}!
          </p>
        </div>
      )}

      {/* Trust Badges */}
      {!compact && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: Shield, label: "Secure" },
            { icon: Truck, label: "Fast Delivery" },
            { icon: Clock, label: "24/7 Support" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 p-2 bg-[#F5F1E8]/50 rounded-lg text-center"
            >
              <Icon className="w-4 h-4 text-primary-500" />
              <span className="text-[10px] font-semibold text-[#6B665D]">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full h-14 mt-5 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold text-base shadow-lg shadow-accent-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      )}

      {/* Payment Methods */}
      {!compact && (
        <div className="mt-4 flex items-center justify-center gap-2 opacity-40">
          {["VISA", "MC", "UPI", "COD"].map((method) => (
            <div
              key={method}
              className="px-2 py-1 bg-[#F5F1E8] rounded text-[9px] font-bold text-[#6B665D]"
            >
              {method}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}