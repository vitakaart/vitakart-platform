// File: apps/web/components/categories/category-card.tsx
// Reusable circular category card — no hover on mobile

"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Pill,
  Dumbbell,
  Leaf,
  Heart,
  Shield,
  Sparkles,
  Brain,
  Sun,
  Package,
} from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/api";

type CategoryStyle = {
  icon: ElementType;
  iconColor: string;
  iconBg: string;
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  vitamins: {
    icon: Pill,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  supplements: {
    icon: Package,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  sports: {
    icon: Dumbbell,
    iconColor: "text-[#A67B5B]",
    iconBg: "bg-[#E9E1D2]/40",
  },
  "sports-nutrition": {
    icon: Dumbbell,
    iconColor: "text-[#A67B5B]",
    iconBg: "bg-[#E9E1D2]/40",
  },
  ayurveda: {
    icon: Leaf,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  herbal: {
    icon: Leaf,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  wellness: {
    icon: Heart,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  immunity: {
    icon: Shield,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  beauty: {
    icon: Sparkles,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  "mind-care": {
    icon: Brain,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
  "bone-care": {
    icon: Sun,
    iconColor: "text-[#059669]",
    iconBg: "bg-[#A7F3D0]/30",
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  icon: Package,
  iconColor: "text-[#059669]",
  iconBg: "bg-[#A7F3D0]/30",
};

interface CategoryCardProps {
  category: Category;
  showProductCount?: boolean;
}

export function CategoryCard({
  category,
  showProductCount = true,
}: CategoryCardProps) {
  const style = CATEGORY_STYLES[category.slug.toLowerCase()] || DEFAULT_STYLE;
  const Icon = style.icon;

  const { data: productsData, isLoading: isCountLoading } = useQuery({
    queryKey: ["category-product-count", category.id],
    queryFn: () =>
      productsApi.getByCategory(category.id, {
        page: 1,
        pageSize: 1,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: showProductCount && !!category.id,
  });

  const productCount = productsData?.totalCount ?? 0;

  return (
    <Link
      href={ROUTES.CATEGORY(category.slug)}
      className="group flex flex-col items-center text-center"
      aria-label={`Browse ${category.name} category`}
    >
      {/* Icon Circle — hover only on lg+ */}
      <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#E9E1D2]/50 bg-[#FFFDF8] shadow-[0_8px_20px_rgba(212,197,169,0.3)] transition-all duration-300 sm:h-24 sm:w-24 lg:group-hover:-translate-y-1 lg:group-hover:border-[#10B981] lg:group-hover:shadow-[0_12px_24px_rgba(212,197,169,0.5)]">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg} transition-transform duration-300 sm:h-14 sm:w-14 lg:group-hover:scale-110`}
        >
          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${style.iconColor}`} />
        </div>
      </div>

      {/* Name — hover color only on lg+ */}
      <div className="mb-0.5 line-clamp-1 text-xs font-bold text-[#0A0A0A] transition-colors sm:text-sm lg:group-hover:text-[#10B981]">
        {category.name}
      </div>

      {/* Product Count */}
      {showProductCount && (
        <div className="text-[10px] font-medium text-[#6B665D] sm:text-xs">
          {isCountLoading
            ? "Loading..."
            : productCount > 0
              ? `${productCount} items`
              : "Coming soon"}
        </div>
      )}

      {/* Sub-category Count */}
      {category.subCategoriesCount > 0 && (
        <div className="mt-0.5 text-[9px] font-semibold text-[#10B981]">
          {category.subCategoriesCount} sub-
          {category.subCategoriesCount > 1 ? "categories" : "category"}
        </div>
      )}
    </Link>
  );
}