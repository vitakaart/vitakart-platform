// File: apps/web/components/product-detail/product-info.tsx
// Right side product info (title, price, buttons, etc.)

"use client";

import { useState } from "react";
import { Star, Heart, MapPin, Zap } from "lucide-react";
import { toast } from "sonner";
import { PackSizeSelector } from "./pack-size-selector";
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isAdding } = useCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push(ROUTES.LOGIN);
      return;
    }
    addToCart({ productId: product.id, quantity: 1 });
  };

  const handleBuyNow = () => {
    toast.success("Redirecting to checkout...");
  };

  return (
    <div className="space-y-5">
      {/* Category & Wishlist */}
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
          {categoryName || "Vitamins"}
        </div>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F1E8] hover:bg-red-50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#6B665D]"
              }`}
          />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-5 h-5 fill-current" />
          <span className="text-sm font-bold text-[#0A0A0A]">4.8</span>
        </div>
        <span className="text-sm text-[#6B665D]">•</span>
        <button className="text-sm text-[#10B981] hover:underline font-medium">
          1,240 Reviews
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-black text-red-600">
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
          disabled={isAdding}
          className="h-12 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          className="h-12 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold shadow-md transition-all hover:scale-[1.02]"
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
            Express Delivery by <span className="font-bold">Tomorrow, 11:00 AM</span>
          </span>
        </div>
      </div>
    </div>
  );
}