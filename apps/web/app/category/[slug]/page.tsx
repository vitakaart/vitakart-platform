// File: apps/web/app/category/[slug]/page.tsx
// Category detail page with sidebar sync

"use client";

import { use, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SortDropdown } from "@/components/shared/sort-dropdown";
import { ViewToggle } from "@/components/shared/view-toggle";
import { ProductsGrid } from "@/components/shared/products-grid";
import {
  FilterSidebar,
  FilterState,
} from "@/components/products/filter-sidebar";
import { TalkToExpertCard } from "@/components/products/talk-to-expert-card";
import { MobileFilterDrawer } from "@/components/products/mobile-filter-drawer";
import { EmptyState } from "@/components/shared/empty-state";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { ROUTES } from "@/lib/constants/routes";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
];

const PAGE_SIZE = 12;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  // Initialize filter with current category slug
  const [filters, setFilters] = useState<FilterState>({
    categories: [slug],
    brands: [],
    minPrice: 0,
    maxPrice: 5000,
    healthGoals: [],
  });

  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ✅ Reset filter when slug changes (navigating between categories)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: [slug],
    }));
  }, [slug]);

  // ✅ Handle sidebar category changes
  useEffect(() => {
    // Skip if categories match current slug
    if (
      filters.categories.length === 1 &&
      filters.categories[0] === slug
    ) {
      return;
    }

    if (filters.categories.length === 0) {
      // "All Categories" clicked → go to products page
      router.push(ROUTES.PRODUCTS);
    } else if (
      filters.categories.length === 1 &&
      filters.categories[0] !== slug
    ) {
      // Different single category → go to that category page
      router.push(`/category/${filters.categories[0]}`);
    } else if (filters.categories.length > 1) {
      // Multiple categories → go to products page
      const params = new URLSearchParams();
      params.set("category", filters.categories[0]);
      router.push(`${ROUTES.PRODUCTS}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.categories]);

  // Fetch category by slug
  const {
    data: category,
    isLoading: isLoadingCategory,
    isError: isCategoryError,
  } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch all categories for sidebar
  const { data: allCategories } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch products in this category
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["category-products", category?.id, filters, sort],
    queryFn: ({ pageParam = 1 }) => {
      if (!category?.id) throw new Error("No category");

      const query: Record<string, string | number> = {
        page: pageParam,
        pageSize: PAGE_SIZE,
      };

      if (sort === "price-asc") {
        query.sortBy = "price";
        query.sortOrder = "asc";
      } else if (sort === "price-desc") {
        query.sortBy = "price";
        query.sortOrder = "desc";
      } else if (sort === "newest") {
        query.sortBy = "newest";
      }

      if (filters.maxPrice < 5000) query.maxPrice = filters.maxPrice;
      if (filters.minPrice > 0) query.minPrice = filters.minPrice;

      return productsApi.getByCategory(category.id, query);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage < lastPage.totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!category?.id,
    staleTime: 60 * 1000,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.brands.length > 0 && product.brand) {
        if (!filters.brands.includes(product.brand)) return false;
      }
      return true;
    });
  }, [allProducts, filters.brands]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [allProducts]);

  // Category not found
  if (!isLoadingCategory && (isCategoryError || !category)) {
    return (
      <MainLayout>
        <div className="container-app py-6 md:py-8">
          <EmptyState
            icon="📦"
            title="Category not found"
            description="The category you're looking for doesn't exist"
            size="lg"
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-8">
        <Breadcrumbs
          items={[
            { label: "HOME", href: ROUTES.HOME },
            { label: "CATEGORIES", href: ROUTES.CATEGORIES },
            { label: category?.name?.toUpperCase() || "LOADING..." },
          ]}
        />

        <div className="mb-6">
          {isLoadingCategory ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 w-64 bg-[#F5F1E8] rounded" />
              <div className="h-4 w-full max-w-2xl bg-[#F5F1E8] rounded" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] mb-3">
                {category?.name}
              </h1>
              {category?.description && (
                <p className="text-sm md:text-base text-[#6B665D] max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="hidden lg:block space-y-6">
            <FilterSidebar
              categories={allCategories ?? []}
              brands={availableBrands}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <TalkToExpertCard />
          </aside>

          <div>
            <div className="flex items-center justify-between gap-3 mb-6 sticky top-16 md:top-18  z-20 bg-[#FEFBF3]/95 backdrop-blur-md py-3 -mx-4 px-3 rounded-xl sticky  md:mx-0 shadow-sm border-b border-[#E9E1D2] md:border-0">
              <div className="text-sm">
                <span className="font-bold text-[#0A0A0A]">
                  {filteredProducts.length}
                </span>
                <span className="text-[#6B665D]">
                  {" "}
                  of {totalCount} products
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E9E1D2] bg-[#FFFDF8] text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <div className="hidden md:block">
                  <ViewToggle view={view} onChange={setView} />
                </div>

                <SortDropdown
                  options={SORT_OPTIONS}
                  value={sort}
                  onChange={setSort}
                />
              </div>
            </div>

            <ProductsGrid
              products={filteredProducts}
              isLoading={isLoading}
              isError={isError}
              hasNextPage={hasNextPage ?? false}
              isFetchingNextPage={isFetchingNextPage}
              totalCount={totalCount}
              onLoadMore={() => fetchNextPage()}
              onRetry={() => refetch()}
              emptyMessage={`No products in ${category?.name || "this category"}`}
              emptyDescription="Try adjusting your filters or check back later"
            />
          </div>
        </div>

        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          categories={allCategories ?? []}
          brands={availableBrands}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </MainLayout>
  );
}