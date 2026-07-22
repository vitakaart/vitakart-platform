"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Package, Heart, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/hooks/use-cart";
import { ROUTES } from "@/lib/constants/routes";
import type { CartItem as CartItemType } from "@/types/api";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem, isUpdating, isRemoving } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isRemovingAnim, setIsRemovingAnim] = useState(false);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity({ itemId: item.id, quantity: item.quantity - 1 });
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.availableStock && item.quantity < 99) {
      updateQuantity({ itemId: item.id, quantity: item.quantity + 1 });
    }
  };

  const handleRemove = () => {
    setIsRemovingAnim(true);
    setTimeout(() => {
      removeItem(item.id);
    }, 200);
  };

  const discountPercent = item.discountPrice
    ? Math.round(((item.unitPrice - item.discountPrice) / item.unitPrice) * 100)
    : 0;

  return (
    <div
      className={`group flex gap-4 ${compact ? "p-2" : "p-2"} bg-[#FFFDF8] border border-[#E9E1D2] rounded-2xl transition-all duration-300 hover:shadow-md hover:border-primary-200 ${isRemovingAnim ? "opacity-0 scale-95 translate-x-4" : "opacity-100 scale-100 translate-x-0"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link
        href={ROUTES.PRODUCT_DETAIL(item.productSlug)}
        className={`relative ${compact ? "w-18 h-18" : "w-24 h-24"} rounded-xl bg-[#F5F1E8] overflow-hidden flex-shrink-0 border border-[#E9E1D2]/50 transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover rounded-xl  transition-transform duration-500 group-hover:scale-104"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-[#6B665D]/40" />
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <TrendingDown className="w-2.5 h-2.5" />
            {discountPercent}%
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* Top: Brand + Name + Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {item.brand && (
              <div className="text-[10px] font-bold uppercase text-primary-600 tracking-[0.15em] truncate mb-0.5">
                {item.brand}
              </div>
            )}
            <Link
              href={ROUTES.PRODUCT_DETAIL(item.productSlug)}
              className={`${compact ? "text-xs" : "text-sm"} font-bold text-[#0A0A0A] line-clamp-2 hover:text-primary-600 transition-colors duration-200 leading-snug`}
            >
              {item.productName}
            </Link>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            {/* <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-[#6B665D] hover:text-red-500 transition-all duration-200"
              aria-label="Save for later"
            >
              <Heart className="w-4 h-4" />
            </button> */}

            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-[#6B665D] hover:text-red-500 transition-all duration-200 disabled:opacity-50"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4 transition-transform hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Bottom: Price + Quantity */}
        <div className="flex items-end justify-between gap-3 mt-3">
          {/* Price Stack */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`${compact ? "text-base" : "text-lg"} text-base font-bold text-red-600 leading-tight`}>
                ₹{item.totalPrice.toLocaleString("en-IN")}
              </span>
              {item.discountPrice && (
                <span className="text-xs text-[#6B665D] line-through font-medium">
                  ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {/* <p className="text-[10px] text-[#6B665D] mt-0.5">
              ₹{item.unitPrice.toLocaleString("en-IN")} / unit
            </p> */}
          </div>

          {/* Quantity Controls */}
          <div className="inline-flex items-center gap-0.5 border-2 border-[#E9E1D2] rounded-full bg-white p-0.5 shadow-sm">
            <button
              onClick={handleDecrease}
              disabled={isUpdating || item.quantity <= 1}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary-50 active:bg-primary-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
            >
              <Minus className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </button>

            <span className="w-[6px]  min-w-[26px] text-center text-sm font-bold text-[#0A0A0A] tabular-nums">
              {isUpdating ? (
                <span className="inline-block w-3 h-3 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
              ) : (
                item.quantity
              )}
            </span>

            <button
              onClick={handleIncrease}
              disabled={isUpdating || item.quantity >= item.availableStock || item.quantity >= 99}
              className="w-5 h-55flex items-center justify-center rounded-full hover:bg-primary-50 active:bg-primary-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5 text-[#0A0A0A]" />
            </button>
          </div>
        </div>

        {/* Low Stock Warning */}
        {item.availableStock <= 5 && item.availableStock > 0 && (
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            Only {item.availableStock} left in stock
          </div>
        )}

        {/* Out of Stock */}
        {item.availableStock === 0 && (
          <div className="mt-2 text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg w-fit">
            Out of stock
          </div>
        )}
      </div>
    </div>
  );
}