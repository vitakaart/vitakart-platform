// File: apps/web/components/home/ayurveda-section.tsx
// Uses reusable ProductCardCompact component

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCardCompact, ProductCardCompactSkeleton } from "@/components/product/product-card-compact";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";

const SUB_CATEGORIES = [
  "Ashwagandha",
  "Turmeric blends",
  "Beauty oils",
  "Detox teas",
];

export function AyurvedaSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["ayurveda-section"],
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
        {/* Feature Card - Dark */}
        <div className="rounded-2xl bg-[#0A0A0A] p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] to-[#10B981]/30" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex-1 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                Curated ayurveda
              </div>
              <h3 className="text-lg font-bold">Herbal & Ayurveda</h3>
              <p className="text-xs text-white/70 mt-1">Wellness rituals for you</p>
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
          View all ayurveda
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ==========================================
           DESKTOP VIEW — Dark Sidebar + Grid
           ========================================== */}
      <div className="hidden lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-5">
        {/* Dark Sidebar */}
        <aside className="rounded-2xl border border-[#E9E1D2] bg-[#0A0A0A] p-5 text-white shadow-sm">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Curated ayurveda</div>
            <h3 className="mt-2 text-xl font-bold">Herbal & Ayurveda</h3>
            <p className="mt-2 text-sm text-white/75">Foundational wellness rituals for stress, immunity and glow.</p>
            <button className="mt-4 min-h-11 rounded-full bg-[#10B981] px-4 py-3 text-xs font-bold transition-all duration-300 hover:scale-105">
              Shop Rituals
            </button>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="rounded-xl bg-white/10 px-4 py-3 font-semibold">Ashwagandha</div>
            {SUB_CATEGORIES.slice(1).map((cat) => (
              <div key={cat} className="rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 cursor-pointer transition-colors">
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