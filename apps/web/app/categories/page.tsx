// File: apps/web/app/categories/page.tsx
// Clean assembly using reusable components

"use client";

import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BentoBanners } from "@/components/categories/bento-banners";
import { CategoriesGrid } from "@/components/categories/categories-grid";
import { categoriesApi } from "@/lib/api/categories";
import { ROUTES } from "@/lib/constants/routes";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "HOME", href: ROUTES.HOME },
            { label: "CATEGORIES" },
          ]}
        />

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-2">
            Shop Smart
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] mb-3">
            All Categories
          </h1>
          <p className="text-sm md:text-base text-[#6B665D] max-w-3xl leading-relaxed">
            Explore our complete range of wellness categories curated for your unique health goals.
          </p>
        </div>

        {/* Bento Banners */}
        <BentoBanners />

        {/* All Categories Section */}
        <div className="mt-10 md:mt-14">
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-1">
              Browse All
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#0A0A0A]">
              All Wellness Categories
            </h2>
          </div>

          <CategoriesGrid
            categories={categories ?? []}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    </MainLayout>
  );
}