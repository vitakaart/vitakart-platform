// File: apps/web/components/home/category-grid.tsx
// Minimal + centered category grid

import Link from "next/link";
import { Pill, Dumbbell, Leaf, Heart, Shield, Sparkles, Brain, Sun, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const CATEGORIES = [
  {
    name: "Vitamins",
    count: "124 items",
    icon: Pill,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    slug: "vitamins",
  },
  {
    name: "Sports",
    count: "86 items",
    icon: Dumbbell,
    iconBg: "bg-orange-50",
    iconColor: "text-[#F59E0B]",
    slug: "sports",
  },
  {
    name: "Ayurveda",
    count: "64 items",
    icon: Leaf,
    iconBg: "bg-green-50",
    iconColor: "text-[#10B981]",
    slug: "ayurveda",
  },
  {
    name: "Wellness",
    count: "73 items",
    icon: Heart,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    slug: "wellness",
  },
  {
    name: "Immunity",
    count: "55 items",
    icon: Shield,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    slug: "immunity",
  },
  {
    name: "Beauty",
    count: "42 items",
    icon: Sparkles,
    iconBg: "bg-fuchsia-50",
    iconColor: "text-fuchsia-600",
    slug: "beauty",
  },
  {
    name: "Mind Care",
    count: "38 items",
    icon: Brain,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    slug: "mind-care",
  },
  {
    name: "Bone Care",
    count: "29 items",
    icon: Sun,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    slug: "bone-care",
  },
];

export function CategoryGrid() {
  return (
    <section className="flex flex-col gap-4">
      {/* Header — Title + Arrow (both mobile & desktop) */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-1">
            Shop Smart
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
            Shop by category
          </h2>
        </div>

        {/* Arrow — Always visible */}
        <Link
          href={ROUTES.CATEGORIES}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-[#E9E1D2] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all group flex-shrink-0"
          aria-label="View all categories"
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Categories Grid — All centered */}
      <div className="grid grid-flow-col auto-cols-[110px] gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-8 lg:overflow-visible lg:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={ROUTES.CATEGORY(cat.slug)}
              className="group snap-start flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#FFFDF8] border border-[#E9E1D2] hover:border-[#10B981] hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${cat.iconColor}`} />
              </div>

              {/* Name */}
              <div className="text-sm font-bold text-[#0A0A0A] mb-0.5">
                {cat.name}
              </div>

              {/* Count */}
              <div className="text-[10px] text-[#6B665D] font-medium">
                {cat.count}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}