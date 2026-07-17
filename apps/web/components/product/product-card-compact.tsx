// File: apps/web/components/product/product-card-compact.tsx
// Reusable compact product card — used in vitamins, ayurveda, other sections

"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { Product } from "@/types/api";

interface ProductCardCompactProps {
  product: Product;
  index?: number;
}

export function ProductCardCompact({ product, index = 0 }: ProductCardCompactProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link
      href={ROUTES.PRODUCT_DETAIL(product.slug)}
      className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-3 shadow-sm hover:shadow-md transition-all group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image container */}
      <div className="rounded-xl bg-[#F5F1E8] ">
        <div className="relative h-30 w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-2xl  group-hover:scale-103 transition-transform duration-300"
              sizes="200px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
          )}
        </div>
      </div>

      {/* Brand */}
      <div className="mt-2 text-[10px] font-semibold uppercase text-[#6B665D] truncate">
        {product.brand || "Vitakart"}
      </div>

      {/* Name */}
      <div className="mt-1 text-xs md:text-sm font-bold text-[#0A0A0A] line-clamp-1">
        {product.name}
      </div>

      {/* Rating */}
      <div className="mt-1.5 flex items-center gap-0.5 text-yellow-500">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={10} fill="currentColor" />
        ))}
        <span className="text-[10px] text-[#6B665D] ml-1">4.7</span>
      </div>

      {/* Price + Button */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm md:text-base font-black text-red-600">
          ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to cart
          }}
          className="h-8 rounded-lg border border-[#E9E1D2] px-2.5 text-[10px] font-bold hover:bg-[#10B981] hover:text-white hover:border-[#10B981] transition-all"
        >
          Add
        </button>
      </div>
    </Link>
  );
}

// Skeleton loader
export function ProductCardCompactSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-3 animate-pulse">
      <div className="h-24 rounded-xl bg-[#F5F1E8]" />
      <div className="mt-2 h-3 w-20 rounded bg-[#F5F1E8]" />
      <div className="mt-2 h-4 w-32 rounded bg-[#F5F1E8]" />
      <div className="mt-2 h-3 w-16 rounded bg-[#F5F1E8]" />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-5 w-14 rounded bg-[#F5F1E8]" />
        <div className="h-8 w-12 rounded-lg bg-[#F5F1E8]" />
      </div>
    </div>
  );
}