// File: apps/web/components/product-detail/product-info.tsx
// Right side product info with REAL rating + wishlist

"use client";

import { useState } from "react";
import { Star, MapPin, Zap } from "lucide-react";
import { toast } from "sonner";
import { PackSizeSelector } from "./pack-size-selector";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { StarRating } from "@/components/reviews/star-rating";
import type { Product } from "@/types/api";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

interface ProductInfoProps {
  product: Product;
  categoryName?: string;
}

export function ProductInfo({ product, categoryName }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("60");
  const { addToCart, isAdding } = useCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
    : 0;

  //  Real ratings
  const hasReviews = product.totalReviews > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push(ROUTES.LOGIN);
      return;
    }
    addToCart({ productId: product.id, quantity: 1 });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to buy this product");
      router.push(ROUTES.LOGIN);
      return;
    }

    // Add to cart then redirect to checkout
    addToCart(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          router.push(ROUTES.CHECKOUT);
        },
      }
    );
  };

  //  Scroll to reviews section
  const handleReviewsClick = () => {
    const reviewsSection = document.getElementById("reviews-section");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Category & Wishlist */}
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
          {categoryName || "Vitamins"}
        </div>

        {/*  Real Wishlist Button */}
        <WishlistButton productId={product.id} size="sm" />
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] leading-tight">
        {product.name}
      </h1>

      {/* Real Rating */}
      {hasReviews ? (
        <button
          onClick={handleReviewsClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
        >
          <div className="flex items-center gap-1">
            <StarRating rating={product.averageRating} size="md" readOnly />
          </div>
          <span className="text-sm font-bold text-[#0A0A0A]">
            {product.averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-[#6B665D]">•</span>
          <span className="text-sm text-[#10B981] font-medium group-hover:underline">
            {product.totalReviews.toLocaleString("en-IN")}{" "}
            {product.totalReviews === 1 ? "Review" : "Reviews"}
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <StarRating rating={0} size="md" readOnly />
          <span className="text-sm text-[#6B665D]">No reviews yet</span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-black text-black">
          ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-[#6B665D] line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="inline-flex px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      {product.stockQuantity > 0 ? (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 font-semibold">
            {product.stockQuantity > 10
              ? "In Stock"
              : `Only ${product.stockQuantity} left!`}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-red-700 font-semibold">Out of Stock</span>
        </div>
      )}

      {/* Pack Size */}
      <PackSizeSelector
        sizes={[
          { label: "60 Tablets", value: "60" },
          { label: "120 Tablets", value: "120" },
        ]}
        selected={selectedSize}
        onChange={setSelectedSize}
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stockQuantity === 0}
          className="h-12 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold shadow-md transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isAdding
            ? "Adding..."
            : product.stockQuantity === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isAdding || product.stockQuantity === 0}
          className="h-12 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold shadow-md transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Buy Now
        </button>
      </div>

      {/* Delivery Details */}
      <div className="rounded-xl bg-[#F5F1E8] border border-[#E9E1D2] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm font-semibold text-[#0A0A0A]">
              Delivery Details
            </span>
          </div>
          <button className="text-xs text-[#10B981] hover:underline font-semibold">
            Change Pincode
          </button>
        </div>
        <div className="flex items-center gap-2 pl-6">
          <Zap className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
          <span className="text-sm text-[#0A0A0A]">
            Express Delivery by{" "}
            <span className="font-bold">Tomorrow, 11:00 AM</span>
          </span>
        </div>
      </div>
    </div>
  );
}