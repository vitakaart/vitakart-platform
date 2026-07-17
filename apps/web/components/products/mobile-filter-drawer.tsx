// File: apps/web/components/products/mobile-filter-drawer.tsx
// Mobile filter drawer (slides from bottom)

"use client";

import { useEffect } from "react";
import { FilterSidebar, FilterState } from "./filter-sidebar";
import type { Category } from "@/types/api";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  brands,
  filters,
  onFiltersChange,
}: MobileFilterDrawerProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[#FFFDF8] rounded-t-3xl shadow-2xl animate-slide-up overflow-y-auto">
        {/* Handle */}
        <div className="sticky top-0 bg-[#FFFDF8] pt-3 pb-2 px-5 border-b border-[#E9E1D2] z-10">
          <div className="w-12 h-1 bg-[#E9E1D2] rounded-full mx-auto mb-3" />
        </div>

        {/* Filters */}
        <div className="p-5">
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClose={onClose}
            isMobile
          />
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 p-4 bg-[#FFFDF8] border-t border-[#E9E1D2]">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}