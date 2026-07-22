// File: apps/web/components/product/product-card-compact.tsx
// UPDATED — Added WishlistButton on image (top-right)

"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Package } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { ProductBadges } from "@/components/products/product-badges";
import { WishlistButton } from "@/components/wishlist/wishlist-button";  // ← ADD
import type { Product } from "@/types/api";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardCompactProps {
  product: Product;
  index?: number;
}

export function ProductCardCompact({ product, index = 0 }: ProductCardCompactProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const { addToCart, isAdding } = useCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push(ROUTES.LOGIN);
      return;
    }

    addToCart({ productId: product.id, quantity: 1 });
  };

  return (
    <Link
      href={ROUTES.PRODUCT_DETAIL(product.slug)}
      className="block rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] shadow-sm hover:shadow-md transition-all group overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/2] rounded-2xl bg-[#F5F1E8] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10">
          <ProductBadges product={product} />
        </div>

        {/*  Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* Image */}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain rounded-2xl group-hover:scale-104 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B665D]">
            <Package className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="text-[10px] font-semibold uppercase text-[#6B665D] tracking-wider truncate">
          {product.brand || "Vitakart"}
        </div>

        <div className="mt-1 text-sm font-bold text-[#0A0A0A] line-clamp-1">
          {product.name}
        </div>

        <div className="mt-1.5 flex items-center gap-0.5 text-yellow-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={10} fill="currentColor" />
          ))}
          <span className="text-[10px] text-[#6B665D] ml-1">4.7 (1.2k)</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-row gap-2 items-center">

            <div className="text-base font-black text-red-600 leading-tight">
              ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
            </div>
            {hasDiscount && (
              <div className="text-[10px] text-[#6B665D] line-through leading-tight">
                ₹{product.price.toLocaleString("en-IN")}
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-8 h-8 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 disabled:opacity-50"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardCompactSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] overflow-hidden">
      <div className="aspect-square bg-[#F5F1E8] animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-20 rounded bg-[#F5F1E8] animate-pulse" />
        <div className="h-4 w-32 rounded bg-[#F5F1E8] animate-pulse" />
        <div className="h-3 w-24 rounded bg-[#F5F1E8] animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded bg-[#F5F1E8] animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-[#F5F1E8] animate-pulse" />
        </div>
      </div>
    </div>
  );
}