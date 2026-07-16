// File: apps/web/components/layout/navbar/mobile-search.tsx
// Full-screen mobile search overlay with popular searches

"use client";

import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Whey Protein",
  "Vitamin C",
  "Multivitamins",
  "Omega 3",
  "Immunity",
  "Weight Loss",
  "Ayurveda",
  "Yoga",
];

const TRENDING_CATEGORIES = [
  { icon: "🌿", label: "Herbal Supplements" },
  { icon: "💊", label: "Vitamins & Minerals" },
  { icon: "🏋️", label: "Sports Nutrition" },
  { icon: "🧘", label: "Wellness Products" },
];

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      handleClose();
    }
  };

  const handleQuickSearch = (query: string) => {
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white md:hidden animate-fade-in flex flex-col">
      {/* Search Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white sticky top-0">
        <button
          onClick={handleClose}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white"
              autoFocus
            />
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 space-y-6">
          {/* Popular Searches */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Popular Searches
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 rounded-full text-sm font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Trending Categories */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-accent-500" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Trending Categories
              </h3>
            </div>
            <div className="space-y-2">
              {TRENDING_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => {
                    handleClose();
                    router.push(ROUTES.CATEGORIES);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    {cat.label}
                  </span>
                  <span className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}