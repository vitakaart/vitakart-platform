// File: apps/web/components/home/brand-story.tsx
// Fixed: Mobile overflow + proper video sizing

import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";

export function BrandStory() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
      {/* Left: Content Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] p-5 md:p-6 lg:p-8 text-white shadow-md">
        {/* Decorative gradients */}
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-64 md:h-64 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-64 md:h-64 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between gap-4 md:gap-6 min-h-[220px] md:min-h-[280px]">
          <div>
            <div className="inline-flex rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider mb-3 md:mb-4">
              Brand Story
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black leading-tight mb-2 md:mb-3">
              Wellness that feels{" "}
              <span className="text-[#10B981]">cinematic</span> and{" "}
              <span className="text-[#F59E0B]">premium</span>.
            </h2>
            <p className="text-xs md:text-sm text-white/70 leading-5 md:leading-6 max-w-md">
              Vitakart is building a next-gen platform for mindful routines—combining trusted brands and startup-grade execution.
            </p>
          </div>

          <div>
            <button className="inline-flex items-center gap-2 h-10 md:h-11 rounded-full bg-white text-[#0A0A0A] px-4 md:px-5 text-xs md:text-sm font-bold transition-all duration-300 hover:scale-105 hover:gap-3">
              Watch Story
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Video Preview — Fixed sizing */}
      <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 aspect-video lg:aspect-auto lg:min-h-[280px]">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
          alt="Wellness lifestyle"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="group/play flex h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-white/95 backdrop-blur-md text-[#0A0A0A] shadow-2xl transition-all duration-300 hover:scale-110">
            <Play className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 ml-1 fill-current" />
          </button>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80 mb-1">
            Watch our story
          </div>
          <h3 className="text-sm md:text-base lg:text-lg font-bold">
            2 min • Behind the scenes
          </h3>
        </div>
      </div>
    </section>
  );
}