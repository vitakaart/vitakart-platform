// File: apps/web/components/home/vitamins-section.tsx
// Uses reusable ProductCardCompact component

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCardCompact, ProductCardCompactSkeleton } from "@/components/product/product-card-compact";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";

const SUB_CATEGORIES = [
  "Daily Multivitamins",
  "Vitamin D3 & K2",
  "Omega 3 & Probiotics",
  "Whey & Creatine",
];

export function VitaminsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["vitamins-section"],
    queryFn: () => productsApi.getAll({ page: 1, pageSize: 6 }),
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.items ?? [];

  return (
    <section className="flex flex-col gap-4">
      {/* ==========================================
           MOBILE VIEW — Compact
           ========================================== */}
      <div className="lg:hidden flex flex-col gap-3">
        {/* Feature Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#10B981]/15 to-[#F59E0B]/15 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B665D] mb-1">
                Weekly discount
              </div>
              <h3 className="text-lg font-bold text-[#0A0A0A]">
                Vitamins & Supplements
              </h3>
              <p className="text-xs text-[#6B665D] mt-1">Flat 20% off</p>
            </div>
            <button className="h-10 rounded-full bg-[#10B981] px-4 text-xs font-bold text-white transition-all duration-300 hover:scale-105 flex items-center gap-1.5 whitespace-nowrap">
              Shop
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="flex-shrink-0 px-4 py-2 rounded-full bg-[#0A0A0A] text-white text-xs font-semibold">
            All
          </button>
          {SUB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-[#F5F1E8] text-[#6B665D] text-xs font-semibold hover:bg-[#0A0A0A] hover:text-white transition-colors whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardCompactSkeleton key={i} />)
            : products.slice(0, 4).map((product, i) => (
                <ProductCardCompact key={product.id} product={product} index={i} />
              ))}
        </div>

        {/* View all button */}
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-[#E9E1D2] text-sm font-semibold text-[#0A0A0A] hover:border-[#10B981] hover:text-[#10B981] transition-all"
        >
          View all vitamins
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ==========================================
           DESKTOP VIEW — Sidebar + Grid
           ========================================== */}
      <div className="hidden lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-5">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-5 shadow-sm">
          <div className="rounded-2xl bg-gradient-to-br from-[#10B981]/15 to-[#F59E0B]/15 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#6B665D]">Weekly discount</div>
            <h3 className="mt-2 text-xl font-bold text-[#0A0A0A]">Vitamins & Supplements</h3>
            <p className="mt-2 text-sm text-[#6B665D]">Flat 20% off on curated nutrition picks.</p>
            <button className="mt-4 min-h-11 rounded-full bg-[#10B981] px-4 py-3 text-xs font-bold text-white transition-all duration-300 hover:scale-105">
              Unlock Savings
            </button>
          </div>

          <div className="mt-5 space-y-2">
            <div className="rounded-xl bg-[#F5F1E8] px-4 py-3 text-sm font-semibold text-[#0A0A0A]">Daily Multivitamins</div>
            {SUB_CATEGORIES.slice(1).map((cat) => (
              <div key={cat} className="rounded-xl px-4 py-3 text-sm text-[#6B665D] hover:bg-[#F5F1E8] cursor-pointer transition-colors">
                {cat}
              </div>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="grid grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardCompactSkeleton key={i} />)
            : products.slice(0, 8).map((product, i) => (
                <ProductCardCompact key={product.id} product={product} index={i} />
              ))}
          {!isLoading && products.length < 8 && (
            <>
              {Array.from({ length: 8 - products.length }).map((_, i) => (
                <ProductCardCompactSkeleton key={i} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}