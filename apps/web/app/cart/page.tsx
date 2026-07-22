// File: apps/web/app/cart/page.tsx
// Full cart page

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CartItem } from "@/components/cart/cart-item";
import { ClearCartModal } from "@/components/cart/clear-cart-modal";

import { OrderSummary } from "@/components/cart/order-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { useCart } from "@/lib/hooks/use-cart";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

function CartContent() {
  const router = useRouter();
  const { cart, isEmpty, isLoading, clearCart, isClearing } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleCheckout = () => {
    router.push(ROUTES.CHECKOUT);
  };

  const handleClearCart = () => {
    clearCart(undefined, {
      onSuccess: () => {
        setShowClearModal(false);  // ← Close modal only after success
      },
    });
  };

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "HOME", href: ROUTES.HOME },
            { label: "CART" },
          ]}
        />

        {/* Page Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#0A0A0A]">
              Shopping Cart
            </h1>
            {cart && !isEmpty && (
              <p className="text-sm text-[#6B665D] mt-1">
                {cart.uniqueItemsCount} unique product{cart.uniqueItemsCount !== 1 ? "s" : ""} • {cart.totalItems} total item{cart.totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {!isEmpty && (
            <Button
              onClick={() => setShowClearModal(true)}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 " />
              Clear All
            </Button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#10B981] animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && isEmpty && <EmptyCart />}

        {/* Cart Content */}
        {!isLoading && !isEmpty && cart && (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Items List */}
            <div className="space-y-3">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Continue Shopping */}
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 text-sm text-[#10B981] font-semibold hover:underline mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary — Sticky on desktop */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary cart={cart} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation */}
      <ClearCartModal
        isOpen={showClearModal}
        itemCount={cart?.totalItems ?? 0}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearCart}  // ← Just call it
        isClearing={isClearing}
      />

    </MainLayout>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}