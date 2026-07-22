// File: apps/web/app/products/page.tsx
// Instagram-style infinite scroll implementation

"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, Loader2, CheckCircle2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SortDropdown } from "@/components/shared/sort-dropdown";
import { ViewToggle } from "@/components/shared/view-toggle";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ProductCardCompact, ProductCardCompactSkeleton } from "@/components/product/product-card-compact";
import { FilterSidebar, FilterState } from "@/components/products/filter-sidebar";
import { TalkToExpertCard } from "@/components/products/talk-to-expert-card";
import { MobileFilterDrawer } from "@/components/products/mobile-filter-drawer";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { ROUTES } from "@/lib/constants/routes";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
];

const PAGE_SIZE = 12;

export default function ProductsPage() {
  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 5000,
    healthGoals: [],
  });

  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Ref for infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  const categories = categoriesData ?? [];

  // ==========================================
  // INFINITE QUERY (Auto-load on scroll)
  // ==========================================
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products-infinite", filters, sort],
    queryFn: ({ pageParam = 1 }) => {
      const query: Record<string, string | number | boolean> = {
        page: pageParam,
        pageSize: PAGE_SIZE,
      };

      // Sort options
      if (sort === "price-asc") {
        query.sortBy = "price";
        query.sortOrder = "asc";
      } else if (sort === "price-desc") {
        query.sortBy = "price";
        query.sortOrder = "desc";
      } else if (sort === "newest") {
        query.sortBy = "newest";
      }

      // Price filter
      if (filters.maxPrice < 5000) {
        query.maxPrice = filters.maxPrice;
      }
      if (filters.minPrice > 0) {
        query.minPrice = filters.minPrice;
      }

      return productsApi.getAll(query);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 60 * 1000,
  });

  // Flatten all pages into single array
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.categorySlug)) return false;
      }
      if (filters.brands.length > 0 && product.brand) {
        if (!filters.brands.includes(product.brand)) return false;
      }
      return true;
    });
  }, [allProducts, filters]);

  // Get unique brands
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [allProducts]);

  // ==========================================
  // INTERSECTION OBSERVER (Auto-load trigger)
  // ==========================================
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px", // Load 200px before reaching bottom
      threshold: 0.1,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.HOME },
            { label: "Categories", href: ROUTES.CATEGORIES },
            { label: "All Products" },
          ]}
        />

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0A0A0A] mb-3">
            Vitamins & Daily Essentials
          </h1>
          {/* <p className="text-sm md:text-base text-[#6B665D] max-w-3xl leading-relaxed">
            Elevate your daily ritual with our science-backed formulations. From organic extracts to clinical-grade essentials, we curate only the purest ingredients to support your lifelong vitality.
          </p> */}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <FilterSidebar
              categories={categories}
              brands={availableBrands}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <TalkToExpertCard />
          </aside>

          {/* Products Section */}
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3 mb-6 sticky top-16 md:top-20  z-20 bg-[#FEFBF3]/95 backdrop-blur-md py-3 -mx-4 px-3 rounded-xl sticky  md:mx-0 shadow-sm border-b border-[#E9E1D2] md:border-0">
              {/* Product Count — Total shown */}
              <div className="text-sm">
                <span className="font-bold text-[#0A0A0A]">
                  {filteredProducts.length}
                </span>
                <span className="text-[#6B665D]"> of {totalCount} products</span>
              </div>

              {/* View + Sort */}
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E9E1D2] bg-[#FFFDF8] text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Desktop View Toggle */}
                <div className="hidden md:block">
                  <ViewToggle view={view} onChange={setView} />
                </div>

                {/* Sort */}
                <SortDropdown
                  options={SORT_OPTIONS}
                  value={sort}
                  onChange={setSort}
                />
              </div>
            </div>

            {/* Error State */}
            {isError && (
              <ErrorState
                title="Failed to load products"
                onRetry={() => refetch()}
              />
            )}

            {/* Empty State */}
            {!isError && !isLoading && filteredProducts.length === 0 && (
              <EmptyState
                icon="🔍"
                title="No products found"
                description="Try adjusting your filters or search"
                size="lg"
              />
            )}

            {/* Products Grid */}
            {!isError && (isLoading || filteredProducts.length > 0) && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {/* Initial loading */}
                  {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <ProductCardCompactSkeleton key={i} />
                    ))}

                  {/* Loaded products */}
                  {!isLoading &&
                    filteredProducts.map((product, i) => (
                      <ProductCardCompact key={product.id} product={product} index={i} />
                    ))}
                </div>

                {/* ==========================================
                     INFINITE SCROLL LOADER
                     ========================================== */}
                
                {/* Loading More Indicator */}
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-[#E9E1D2]" />
                      <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm text-[#6B665D] font-medium">
                      Loading more products...
                    </p>
                  </div>
                )}

                {/* Trigger element for infinite scroll */}
                {hasNextPage && !isFetchingNextPage && (
                  <div ref={loadMoreRef} className="h-4" />
                )}

                {/* All Caught Up Message */}
                {!hasNextPage && !isLoading && filteredProducts.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#0A0A0A]">
                        You&apos;re all caught up!
                      </p>
                      <p className="text-xs text-[#6B665D] mt-1">
                        Showing all {filteredProducts.length} products
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          categories={categories}
          brands={availableBrands}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </MainLayout>
  );
}