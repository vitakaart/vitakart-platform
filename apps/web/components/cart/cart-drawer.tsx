// File: apps/web/components/cart/cart-drawer.tsx
// Side drawer for quick cart view

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "./cart-item";
import { EmptyCart } from "./empty-cart";
import { ROUTES } from "@/lib/constants/routes";

export function CartDrawer() {
  const { isOpen, close } = useCartStore();
  const { cart, isLoading, isEmpty } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={close}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#FEFBF3] shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E9E1D2] bg-[#FFFDF8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-lg font-bold text-[#0A0A0A]">
              My Cart {cart && cart.totalItems > 0 && (
                <span className="text-[#6B665D] font-normal">
                  ({cart.totalItems})
                </span>
              )}
            </h2>
          </div>

          <button
            onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
            </div>
          ) : isEmpty ? (
            <EmptyCart onClose={close} />
          ) : (
            <div className="p-4 space-y-3">
              {cart?.items.map((item) => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {!isEmpty && cart && (
          <div className="border-t border-[#E9E1D2] p-4 bg-[#FFFDF8] space-y-3">
            {/* Quick Summary */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B665D]">Subtotal</span>
              <span className="text-lg font-bold text-[#0A0A0A]">
                ₹{cart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {cart.shippingFee === 0 && cart.subtotal > 0 && (
              <div className="text-xs text-[#10B981] font-semibold text-center">
                🚚 You qualify for FREE shipping!
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href={ROUTES.CART}
                onClick={close}
                className="w-full h-11 rounded-full border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-bold flex items-center justify-center gap-2 transition-all"
              >
                View Cart
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={ROUTES.CHECKOUT}
                onClick={close}
                className="w-full h-11 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}