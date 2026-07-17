// File: apps/web/components/categories/category-card.tsx
// Reusable small category card with real product count

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Pill, Dumbbell, Leaf, Heart, Shield, Sparkles, Brain, Sun, Package
} from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/api";

// Icon + color mapping
const CATEGORY_STYLES: Record<string, { icon: React.ElementType; iconColor: string; iconBg: string }> = {
  vitamins: { icon: Pill, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  supplements: { icon: Package, iconColor: "text-indigo-600", iconBg: "bg-indigo-50" },
  sports: { icon: Dumbbell, iconColor: "text-[#F59E0B]", iconBg: "bg-orange-50" },
  "sports-nutrition": { icon: Dumbbell, iconColor: "text-[#F59E0B]", iconBg: "bg-orange-50" },
  ayurveda: { icon: Leaf, iconColor: "text-[#10B981]", iconBg: "bg-green-50" },
  herbal: { icon: Leaf, iconColor: "text-[#10B981]", iconBg: "bg-green-50" },
  wellness: { icon: Heart, iconColor: "text-pink-600", iconBg: "bg-pink-50" },
  immunity: { icon: Shield, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
  beauty: { icon: Sparkles, iconColor: "text-fuchsia-600", iconBg: "bg-fuchsia-50" },
  "mind-care": { icon: Brain, iconColor: "text-teal-600", iconBg: "bg-teal-50" },
  "bone-care": { icon: Sun, iconColor: "text-yellow-600", iconBg: "bg-yellow-50" },
};

const DEFAULT_STYLE = { icon: Package, iconColor: "text-gray-600", iconBg: "bg-gray-50" };

interface CategoryCardProps {
  category: Category;
  showProductCount?: boolean;
}

export function CategoryCard({ category, showProductCount = true }: CategoryCardProps) {
  const style = CATEGORY_STYLES[category.slug.toLowerCase()] || DEFAULT_STYLE;
  const Icon = style.icon;

  // Fetch product count
  const { data: productsData } = useQuery({
    queryKey: ["category-count", category.id],
    queryFn: () => productsApi.getByCategory(category.id, { page: 1, pageSize: 1 }),
    staleTime: 5 * 60 * 1000,
    enabled: showProductCount,
  });

  const productCount = productsData?.totalCount ?? 0;

  return (
    <Link
      href={ROUTES.CATEGORY(category.slug)}
      className="group flex flex-col items-center justify-center text-center p-4 md:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E9E1D2] hover:border-[#10B981] hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {/* Icon */}
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${style.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 md:w-8 md:h-8 ${style.iconColor}`} />
      </div>

      {/* Name */}
      <div className="text-sm md:text-base font-bold text-[#0A0A0A] mb-1 line-clamp-1">
        {category.name}
      </div>

      {/* Product Count */}
      {showProductCount && (
        <div className="text-[10px] md:text-xs text-[#6B665D] font-medium">
          {productCount > 0
            ? `${productCount} product${productCount > 1 ? "s" : ""}`
            : "Coming soon"}
        </div>
      )}

      {/* Sub-categories */}
      {category.subCategoriesCount > 0 && (
        <div className="mt-1 text-[9px] text-[#10B981] font-semibold">
          {category.subCategoriesCount} sub-{category.subCategoriesCount > 1 ? "categories" : "category"}
        </div>
      )}
    </Link>
  );
}