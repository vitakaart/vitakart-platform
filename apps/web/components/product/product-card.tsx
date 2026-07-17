// File: apps/web/components/product/product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { Product } from "@/types/api";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
    : 0;

  return (
    <Link
      href={ROUTES.PRODUCT_DETAIL(product.slug)}
      className="w-full md:w-[189px] flex-shrink-0 rounded-3xl border border-[#E9E1D2] bg-[#FFFDF8] p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative rounded-3xl bg-[#F5F1E8]">
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white z-10">
            {discountPercent}% OFF
          </span>
        )}
        <div className="relative h-28 w-full mx-auto">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-3xl group-hover:scale-110 transition-transform duration-500"
              sizes="150px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
          )}
        </div>
      </div>

      <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B665D] truncate">
        {product.brand || "Vitakart"}
      </div>
      <h3 className="mt-1 text-sm font-bold leading-5 line-clamp-2 h-10 text-[#0A0A0A]">
        {product.name}
      </h3>

      <div className="mt-2 flex items-center gap-1 text-yellow-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={12} fill="currentColor" />
        ))}
        <span className="text-[11px] font-semibold text-[#6B665D] ml-1">4.8</span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-lg font-black text-red-600">
            ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
          </div>
          {hasDiscount && (
            <div className="text-[11px] text-[#6B665D] line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </div>
          )}
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="min-h-8 rounded-2xl bg-[#F59E0B] px-2 py-2 text-xs font-bold text-[#0A0A0A] transition-all duration-300 hover:scale-105"
        >
          Add
        </button>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="w-full md:w-[180px] rounded-3xl border border-[#E9E1D2] bg-[#FFFDF8] p-3">
      <div className="h-32 rounded-2xl bg-[#F5F1E8] animate-pulse" />
      <div className="mt-3 h-3 w-20 rounded bg-[#F5F1E8] animate-pulse" />
      <div className="mt-2 h-4 w-32 rounded bg-[#F5F1E8] animate-pulse" />
      <div className="mt-3 h-4 w-16 rounded bg-[#F5F1E8] animate-pulse" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-14 rounded bg-[#F5F1E8] animate-pulse" />
        <div className="h-10 w-14 rounded-2xl bg-[#F5F1E8] animate-pulse" />
      </div>
    </div>
  );
}