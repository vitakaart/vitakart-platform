// File: apps/web/components/product-detail/ayurveda-banner.tsx
// Cinematic ayurveda banner

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AyurvedaBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md aspect-[16/6] group">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80"
        alt="Ayurveda tradition"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 md:p-8 text-white max-w-md">
        <div>
          <div className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3">
            The Roots of Vitality
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Ancient Wisdom, Modern Precision
          </h3>
          <p className="text-xs md:text-sm text-white/80 leading-5">
            Inspired by the Vedic principles of longevity, we infuse every bottle with the spirit of Indian herbal heritage, validated by rigorous clinical science.
          </p>
        </div>

        <Link
          href="#"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white text-[#0A0A0A] text-xs font-bold w-fit hover:gap-3 transition-all"
        >
          Explore Ayurveda
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}