// File: apps/web/components/home/featured-products.tsx
// Premium feature cards - Mobile scroll + Desktop grid

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    tag: "Vitamins",
    title: "Daily health, simplified.",
    subtitle: "C, D3, multivitamins and targeted blends",
    bg: "bg-[#10B981]",
    textColor: "text-white",
    subColor: "text-white/80",
    btnBg: "bg-white/15 hover:bg-white/25",
    btnText: "text-white",
    decorative: "bg-white/10",
  },
  {
    tag: "Herbal",
    title: "Clean nature-forward care.",
    subtitle: "Ashwagandha, turmeric and holistic wellness",
    bg: "bg-[#F59E0B]",
    textColor: "text-[#0A0A0A]",
    subColor: "text-[#0A0A0A]/80",
    btnBg: "bg-[#FEFBF3]/40 hover:bg-[#FEFBF3]/60",
    btnText: "text-[#0A0A0A]",
    decorative: "bg-[#FEFBF3]/30",
  },
  {
    tag: "Supplements",
    title: "Smart nutrition for busy lives.",
    subtitle: "Omega 3, probiotics and clean daily support",
    bg: "bg-[#FFFDF8]",
    textColor: "text-[#0A0A0A]",
    subColor: "text-[#6B665D]",
    btnBg: "border border-[#E9E1D2] hover:bg-[#F5F1E8]",
    btnText: "text-[#0A0A0A]",
    decorative: "bg-[#10B981]/10",
    border: true,
  },
  {
    tag: "Sports Nutrition",
    title: "Performance with premium precision.",
    subtitle: "Whey, creatine and endurance essentials",
    bg: "bg-[#0A0A0A]",
    textColor: "text-white",
    subColor: "text-white/75",
    btnBg: "bg-[#10B981] hover:bg-[#10B981]/90",
    btnText: "text-white",
    decorative: "bg-[#10B981]/20",
  },
];

export function FeaturedProducts() {
  return (
    <section>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-2 md:gap-4 md:overflow-visible xl:grid-cols-4">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={`group flex-shrink-0 w-[260px] md:w-auto relative overflow-hidden rounded-2xl ${card.bg} ${card.border ? 'border border-[#E9E1D2]' : ''} p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Decorative element */}
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${card.decorative}`} />
            <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${card.decorative} blur-2xl`} />

            <div className="relative z-10">
              {/* Tag */}
              <div className={`text-[10px] font-semibold uppercase tracking-wider ${card.subColor} mb-2`}>
                {card.tag}
              </div>

              {/* Title */}
              <h3 className={`text-base md:text-lg font-bold ${card.textColor} leading-tight mb-2`}>
                {card.title}
              </h3>

              {/* Subtitle */}
              <p className={`text-xs ${card.subColor} line-clamp-2 mb-4`}>
                {card.subtitle}
              </p>

              {/* CTA */}
              <button className={`inline-flex items-center gap-1.5 h-9 rounded-full ${card.btnBg} px-4 text-xs font-bold ${card.btnText} transition-all duration-300 hover:gap-2`}>
                Explore
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}