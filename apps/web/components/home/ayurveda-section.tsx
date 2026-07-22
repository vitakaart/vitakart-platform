// File: apps/web/components/home/ayurveda-section.tsx
// Clean version using reusable components

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCardCompact } from "@/components/product/product-card-compact";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardSkeleton } from "@/components/shared/loading-state";
import { FeatureCard } from "@/components/shared/feature-card";
import { CategoryChip } from "@/components/shared/category-chip";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";

const SUB_CATEGORIES = [
  "All",
  "Ashwagandha",
  "Turmeric blends",
  "Beauty oils",
  "Detox teas",
];

export function AyurvedaSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ayurveda-section"],
    queryFn: async () => {
      try {
        const cats = await categoriesApi.getAll();
        const ayurvedaCategory = cats.find(c =>
          c.slug.toLowerCase().includes('ayurveda') ||
          c.slug.toLowerCase().includes('herbal')
        );
        
        if (ayurvedaCategory) {
          const result = await productsApi.getByCategory(ayurvedaCategory.id, { page: 1, pageSize: 8 });
          return result.items;
        }
      } catch (err) {
        console.log('Falling back to all products');
      }
      
      const result = await productsApi.getAll({ page: 1, pageSize: 8 });
      return result.items;
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data ?? [];

  return (
    <section className="flex flex-col gap-4">
      {/* ==========================================
           MOBILE VIEW
           ========================================== */}
      <div className="lg:hidden flex flex-col gap-3">
        {/* Feature Card - Dark variant */}
        <FeatureCard
          tag="Curated ayurveda"
          title="Herbal & Ayurveda"
          subtitle="Wellness rituals for you"
          ctaLabel="Shop"
          variant="dark"
          compact
        />

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {SUB_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            />
          ))}
        </div>

        {/* Content */}
        {error && <ErrorState onRetry={() => refetch()} />}
        
        {!error && !isLoading && products.length === 0 && (
          <EmptyState
            title="No ayurveda products yet"
            description="Check back soon!"
          />
        )}

        {!error && (isLoading || products.length > 0) && (
          <div className="grid grid-cols-2 gap-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : products.slice(0, 6).map((product, i) => (
                  <ProductCardCompact key={product.id} product={product} index={i} />
                ))}
          </div>
        )}

        {/* View all */}
        {!error && products.length > 0 && (
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-[#E9E1D2] text-sm font-semibold text-[#0A0A0A] hover:border-[#10B981] hover:text-[#10B981] transition-all"
          >
            View all ayurveda
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* ==========================================
           DESKTOP VIEW
           ========================================== */}
      <div className="hidden lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-5">
        {/* Dark Sidebar */}
        <aside className="rounded-2xl border border-[#E9E1D2] bg-[#0A0A0A] p-5 text-white shadow-sm">
          <FeatureCard
            tag="Curated ayurveda"
            title="Herbal & Ayurveda"
            subtitle="Foundational wellness rituals for stress, immunity and glow."
            ctaLabel="Shop Rituals"
            variant="dark"
            className="!p-4"
          />

          <div className="mt-5 space-y-2 text-sm">
            {SUB_CATEGORIES.map((cat, i) => (
              <div
                key={cat}
                className={`rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  i === 0
                    ? "bg-white/10 font-semibold text-white"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </aside>

        {/* Products */}
        {error && <ErrorState onRetry={() => refetch()} />}
        
        {!error && !isLoading && products.length === 0 && (
          <EmptyState
            title="No ayurveda products yet"
            description="Products will appear here soon!"
            size="lg"
          />
        )}

        {!error && (isLoading || products.length > 0) && (
          <div className="grid grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : products.slice(0, 8).map((product, i) => (
                  <ProductCardCompact key={product.id} product={product} index={i} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}