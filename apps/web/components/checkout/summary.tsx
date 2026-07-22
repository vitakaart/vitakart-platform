"use client";

import { Loader2, ShieldCheck, Truck, Clock, Gift, Tag } from "lucide-react";
import type { Cart } from "@/types/api";

interface Props {
  cart: Cart;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export function Summary({ cart, onPlaceOrder, isSubmitting, disabled }: Props) {
  const freeShippingThreshold = 999;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const progressPercent = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
          <Gift className="w-4 h-4 text-accent-600" />
        </div>
        <h2 className="text-lg font-bold text-[#0A0A0A]">Order Summary</h2>
      </div>

      {/* Free Shipping Progress */}
      {cart.subtotal < freeShippingThreshold && cart.shippingFee > 0 && (
        <div className="p-3 bg-primary-50/50 border border-primary-100 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-primary-700 font-semibold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Free Shipping
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
            Add ₹{amountForFreeShipping.toLocaleString("en-IN")} more for free delivery
          </p>
        </div>
      )}

      {cart.shippingFee === 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-xs font-bold text-green-700">🎉 You qualify for FREE shipping!</span>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-[#E9E1D2]">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B665D] flex items-center gap-1.5">
            Subtotal
            <span className="text-[10px] bg-[#F5F1E8] px-1.5 py-0.5 rounded text-[#6B665D] font-medium">
              {cart.totalItems} items
            </span>
          </span>
          <span className="font-semibold text-[#0A0A0A]">
            ₹{(cart.subtotal + cart.totalDiscount).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Discount */}
        {cart.totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm animate-fade-in">
            <span className="text-[#6B665D] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-500" />
              Discount
            </span>
            <span className="font-bold text-primary-600">
              -₹{cart.totalDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B665D]">Shipping</span>
          {cart.shippingFee === 0 ? (
            <span className="font-bold text-primary-600 flex items-center gap-1">
              <span className="text-lg">🚚</span> FREE
            </span>
          ) : (
            <span className="font-semibold text-[#0A0A0A]">
              ₹{cart.shippingFee.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t-2 border-[#E9E1D2]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base font-bold text-[#0A0A0A]">Total</span>
          <div className="text-right">
            <p className="text-2xl font-black text-[#0A0A0A] tabular-nums">
              ₹{cart.total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        {cart.totalDiscount > 0 && (
          <p className="text-xs text-primary-600 font-semibold text-right">
            You save ₹{cart.totalDiscount.toLocaleString("en-IN")} on this order
          </p>
        )}
        <p className="text-[10px] text-[#6B665D] text-right mt-1">Including all taxes & fees</p>
      </div>


      {disabled && (
        <p className="text-xs text-red-500 font-semibold text-center bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
          ⚠️ Please select a delivery address
        </p>
      )}
      {/* Place Order Button */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting || disabled}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-base shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Placing Your Order...</span>
          </>
        ) : (
          <>
            <span>Place Order</span>
            <span className="text-primary-200 text-sm font-medium">•</span>
            <span className="text-sm font-medium">₹{cart.total.toLocaleString("en-IN")}</span>
          </>
        )}
      </button>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { icon: ShieldCheck, label: "Secure", color: "text-primary-500" },
          { icon: Truck, label: "Fast Delivery", color: "text-accent-500" },
          { icon: Clock, label: "24/7 Support", color: "text-primary-500" },
        ].map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 p-2.5 bg-[#F5F1E8]/50 rounded-xl border border-[#E9E1D2]/50"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-[10px] font-bold text-[#6B665D]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}