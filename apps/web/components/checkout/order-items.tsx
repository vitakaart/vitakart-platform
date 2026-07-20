"use client";

import Image from "next/image";
import { Package, ShoppingBag, TrendingDown } from "lucide-react";
import type { Cart } from "@/types/api";

interface Props {
  cart: Cart;
}

export function OrderItems({ cart }: Props) {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0A0A0A]">
            Order Items
          </h2>
          <p className="text-xs text-[#6B665D]">{cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
        {cart.items.map((item, index) => {
          const discountPercent = item.discountPrice
            ? Math.round(((item.unitPrice - item.discountPrice) / item.unitPrice) * 100)
            : 0;

          return (
            <div
              key={item.id}
              className="flex gap-3 p-3 rounded-xl bg-[#FAFAF7] border border-[#E9E1D2] hover:border-primary-200 hover:shadow-sm transition-all duration-200 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="w-16 h-16 rounded-lg bg-white border border-[#E9E1D2] overflow-hidden flex-shrink-0 relative">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover rounded-xl  transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F5F1E8]">
                    <Package className="w-6 h-6 text-[#6B665D]" />
                  </div>
                )}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                    <TrendingDown className="w-2 h-2" />
                    {discountPercent}%
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  {item.brand && (
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.15em]">
                      {item.brand}
                    </p>
                  )}
                  <h4 className="text-sm font-bold text-[#0A0A0A] line-clamp-2 leading-snug">
                    {item.productName}
                  </h4>
                  {item.variantName && (
                    <p className="text-[11px] text-[#6B665D] mt-0.5">{item.variantName}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-md">
                      {item.quantity}x
                    </span>
                    <span className="text-xs text-[#6B665D]">
                      @ ₹{item.unitPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#0A0A0A]">
                      ₹{item.totalPrice.toLocaleString("en-IN")}
                    </span>
                    {item.discountPrice && (
                      <p className="text-[10px] text-[#6B665D] line-through">
                        ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item count summary */}
      <div className="mt-4 pt-3 border-t border-[#E9E1D2] flex items-center justify-between text-xs text-[#6B665D]">
        <span>{cart.uniqueItemsCount} unique product{cart.uniqueItemsCount !== 1 ? "s" : ""}</span>
        <span className="font-semibold text-[#0A0A0A]">{cart.totalItems} total item{cart.totalItems !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}