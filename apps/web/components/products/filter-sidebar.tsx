// File: apps/web/components/products/filter-sidebar.tsx
// Filters sidebar (desktop + drawer content for mobile)

"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/api";

export interface FilterState {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  healthGoals: string[];
}

interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const HEALTH_GOALS = ["Immunity", "Energy", "Sleep", "Digestion", "Recovery", "Focus"];

export function FilterSidebar({
  categories,
  brands,
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const toggleCategory = (slug: string) => {
    const newCategories = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const toggleHealthGoal = (goal: string) => {
    const newGoals = filters.healthGoals.includes(goal)
      ? filters.healthGoals.filter((g) => g !== goal)
      : [...filters.healthGoals, goal];
    onFiltersChange({ ...filters, healthGoals: newGoals });
  };

  const clearAll = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 5000,
      healthGoals: [],
    });
  };

  const hasFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.healthGoals.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 5000;

  return (
    <div className={cn("bg-[#FFFDF8]", !isMobile && "rounded-2xl border border-[#E9E1D2] p-5")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-[#10B981] uppercase tracking-wider">
            Expert Filters
          </h3>
        </div>

        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 hover:bg-[#F5F1E8] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="mb-4 text-xs text-[#10B981] font-semibold hover:underline"
        >
          Clear all filters
        </button>
      )}

      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <CheckboxItem
            label="All Categories"
            checked={filters.categories.length === 0}
            onChange={() => onFiltersChange({ ...filters, categories: [] })}
          />
          {categories.map((cat) => (
            <CheckboxItem
              key={cat.id}
              label={cat.name}
              checked={filters.categories.includes(cat.slug)}
              onChange={() => toggleCategory(cat.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="text-xs text-[#6B665D] mb-2">
          ₹{filters.minPrice} - ₹{filters.maxPrice}+
        </div>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) =>
            onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-[#10B981]"
        />
      </FilterSection>

      {/* Health Goals */}
      <FilterSection title="Health Goals">
        <div className="flex flex-wrap gap-2">
          {HEALTH_GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleHealthGoal(goal)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filters.healthGoals.includes(goal)
                  ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]"
                  : "bg-[#FFFDF8] border-[#E9E1D2] text-[#6B665D] hover:border-[#10B981]"
              )}
            >
              {goal}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Brand" isLast>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.slice(0, 10).map((brand) => (
              <CheckboxItem
                key={brand}
                label={brand}
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

// Section wrapper
function FilterSection({
  title,
  children,
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className={cn("py-4", !isLast && "border-b border-[#E9E1D2]")}>
      <h4 className="text-sm font-bold text-[#0A0A0A] mb-3">{title}</h4>
      {children}
    </div>
  );
}

// Checkbox item
function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#E9E1D2] text-[#10B981] focus:ring-[#10B981] cursor-pointer"
      />
      <span className="text-sm text-[#0A0A0A] group-hover:text-[#10B981] transition-colors">
        {label}
      </span>
    </label>
  );
}