// File: apps/web/components/categories/bento-banners.tsx
// Bento grid banners for categories page

import { BentoBannerCard } from "./bento-banner-card";
import { ROUTES } from "@/lib/constants/routes";

const BANNERS = [
  {
    title: "Premium Ayurveda",
    subtitle: "Ancient wisdom for modern wellness",
    cta: "Explore",
    slug: "ayurveda",
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-transparent",
    size: "large" as const,
  },
  {
    title: "Vitamins",
    subtitle: "Daily essentials",
    cta: "Shop",
    slug: "vitamins",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    overlay: "from-blue-600/90 via-blue-600/50 to-transparent",
    size: "small" as const,
  },
  {
    title: "Sports Nutrition",
    subtitle: "Fuel your performance",
    cta: "Shop",
    slug: "sports",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80",
    overlay: "from-[#F59E0B]/90 via-[#F59E0B]/50 to-transparent",
    size: "small" as const,
  },
];

export function BentoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-4 md:h-[400px]">
      {/* Large Banner - spans 2 rows on desktop */}
      <BentoBannerCard
        {...BANNERS[0]}
        href={ROUTES.CATEGORY(BANNERS[0].slug)}
        className="md:col-span-2 md:row-span-2"
      />

      {/* Small Banner 1 */}
      <BentoBannerCard
        {...BANNERS[1]}
        href={ROUTES.CATEGORY(BANNERS[1].slug)}
      />

      {/* Small Banner 2 */}
      <BentoBannerCard
        {...BANNERS[2]}
        href={ROUTES.CATEGORY(BANNERS[2].slug)}
      />
    </div>
  );
}