// File: apps/web/components/products/filter-sidebar.tsx
// Multi-select checkboxes with proper "All Categories" logic

"use client";

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

const HEALTH_GOALS = [
  "Immunity",
  "Energy",
  "Sleep",
  "Digestion",
  "Recovery",
  "Focus",
];

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

  // "All Categories" is checked ONLY when no categories selected
  const isAllCategoriesChecked = filters.categories.length === 0;

  return (
    <div
      className={cn(
        "bg-[#FFFDF8]",
        !isMobile && "rounded-2xl border border-[#E9E1D2] p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-[#10B981] uppercase tracking-wider">
            Expert Filters
          </h3>
        </div>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F5F1E8] rounded-lg"
          >
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

      {/* Categories (Multi-select checkboxes) */}
      <FilterSection title="Categories">
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {/* All Categories — clears all selections */}
          <CheckboxItem
            label="All Categories"
            checked={isAllCategoriesChecked}
            onChange={() => {
              // If already checked, do nothing; else clear all categories
              if (!isAllCategoriesChecked) {
                onFiltersChange({ ...filters, categories: [] });
              }
            }}
            highlight={isAllCategoriesChecked}
          />

          {/* Individual categories — multi-select */}
          {categories.map((cat) => {
            const isChecked = filters.categories.includes(cat.slug);
            return (
              <CheckboxItem
                key={cat.id}
                label={cat.name}
                checked={isChecked}
                onChange={() => toggleCategory(cat.slug)}
                highlight={isChecked}
              />
            );
          })}
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
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brands.slice(0, 10).map((brand) => {
              const isChecked = filters.brands.includes(brand);
              return (
                <CheckboxItem
                  key={brand}
                  label={brand}
                  checked={isChecked}
                  onChange={() => toggleBrand(brand)}
                  highlight={isChecked}
                />
              );
            })}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

// ==========================================
// SECTION WRAPPER
// ==========================================
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

// ==========================================
// CHECKBOX ITEM (with highlight support)
// ==========================================
function CheckboxItem({
  label,
  checked,
  onChange,
  highlight = false,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  highlight?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#E9E1D2] text-[#10B981] focus:ring-[#10B981] focus:ring-offset-0 cursor-pointer accent-[#10B981]"
      />
      <span
        className={cn(
          "text-sm transition-colors",
          highlight
            ? "text-[#10B981] font-semibold"
            : "text-[#0A0A0A] group-hover:text-[#10B981]"
        )}
      >
        {label}
      </span>
    </label>
  );
}