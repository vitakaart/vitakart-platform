// File: apps/web/app/search/page.tsx
// Search results page

"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Filter, Search, X } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SortDropdown } from "@/components/shared/sort-dropdown";
import { ProductsGrid } from "@/components/shared/products-grid";
import { FilterSidebar, FilterState } from "@/components/products/filter-sidebar";
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

const POPULAR_SEARCHES = [
  "Vitamin C",
  "Whey Protein",
  "Ashwagandha",
  "Multivitamin",
  "Omega 3",
  "Ayurveda",
];

const PAGE_SIZE = 12;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 5000,
    healthGoals: [],
  });

  const [sort, setSort] = useState("relevance");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch categories
  const { data: allCategories } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch search results
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search-products", query, filters, sort],
    queryFn: ({ pageParam = 1 }) => {
      const searchQuery: Record<string, string | number> = {
        page: pageParam,
        pageSize: PAGE_SIZE,
        search: query,
      };

      if (sort === "price-asc") {
        searchQuery.sortBy = "price";
        searchQuery.sortOrder = "asc";
      } else if (sort === "price-desc") {
        searchQuery.sortBy = "price";
        searchQuery.sortOrder = "desc";
      } else if (sort === "newest") {
        searchQuery.sortBy = "newest";
      }

      if (filters.maxPrice < 5000) {
        searchQuery.maxPrice = filters.maxPrice;
      }
      if (filters.minPrice > 0) {
        searchQuery.minPrice = filters.minPrice;
      }

      return productsApi.getAll(searchQuery);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage < lastPage.totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!query,
    staleTime: 60 * 1000,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

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

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchInput(term);
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(term)}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push(ROUTES.SEARCH);
  };

  // No search query state
  if (!query) {
    return (
      <MainLayout>
        <div className="container-app py-6 md:py-8">
          <Breadcrumbs
            items={[
              { label: "HOME", href: ROUTES.HOME },
              { label: "SEARCH" },
            ]}
          />

          <div className="max-w-2xl mx-auto py-12 md:py-20 text-center">
            <div className="inline-flex w-20 h-20 rounded-full bg-[#10B981]/10 items-center justify-center mb-4">
              <Search className="w-10 h-10 text-[#10B981]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-3">
              What are you looking for?
            </h1>
            <p className="text-sm md:text-base text-[#6B665D] mb-8">
              Search from thousands of wellness products
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B665D]" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search vitamins, ayurveda, whey..."
                  className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-[#E9E1D2] focus:border-[#10B981] outline-none text-base"
                  autoFocus
                />
              </div>
            </form>

            {/* Popular Searches */}
            <div>
              <p className="text-sm font-semibold text-[#0A0A0A] mb-3">
                Popular searches:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-4 py-2 bg-[#FFFDF8] hover:bg-[#10B981] hover:text-white border border-[#E9E1D2] rounded-full text-sm font-medium transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "HOME", href: ROUTES.HOME },
            { label: "SEARCH" },
            { label: `"${query}"` },
          ]}
        />

        {/* Search Header */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-2">
            Search Results
          </div>
          <h1 className="text-xl md:text-4xl font-bold text-[#0A0A0A] mb-3">
            Results for &ldquo;{query}&rdquo;
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B665D]" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-[#E9E1D2] focus:border-[#10B981] outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F5F1E8]"
                >
                  <X className="w-4 h-4 text-[#6B665D]" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <FilterSidebar
              categories={allCategories ?? []}
              brands={availableBrands}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <TalkToExpertCard />
          </aside>

          {/* Results Section */}
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3 mb-6 sticky top-16 md:top-20  z-20 bg-[#FEFBF3]/95 backdrop-blur-md py-3 -mx-4 px-3 md:rounded-xl sticky  md:mx-0 shadow-sm border-b border-[#E9E1D2] md:border-0">
              <div className="text-sm">
                <span className="font-bold text-[#0A0A0A]">
                  {filteredProducts.length}
                </span>
                <span className="text-[#6B665D]"> of {totalCount} results</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E9E1D2] bg-[#FFFDF8] text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <SortDropdown
                  options={SORT_OPTIONS}
                  value={sort}
                  onChange={setSort}
                />
              </div>
            </div>

            {/* Products Grid */}
            <ProductsGrid
              products={filteredProducts}
              isLoading={isLoading}
              isError={isError}
              hasNextPage={hasNextPage ?? false}
              isFetchingNextPage={isFetchingNextPage}
              totalCount={totalCount}
              onLoadMore={() => fetchNextPage()}
              onRetry={() => refetch()}
              emptyMessage={`No results for "${query}"`}
              emptyDescription="Try different keywords or check spelling"
            />

            {/* Suggestions if no results */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-[#0A0A0A] mb-3">
                  Try these popular searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-4 py-2 bg-[#FFFDF8] hover:bg-[#10B981] hover:text-white border border-[#E9E1D2] rounded-full text-sm font-medium transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container-app py-6 md:py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-64 bg-[#F5F1E8] rounded" />
            <div className="h-12 w-full max-w-2xl bg-[#F5F1E8] rounded-full" />
          </div>
        </div>
      </MainLayout>
    }>
      <SearchContent />
    </Suspense>
  );
}