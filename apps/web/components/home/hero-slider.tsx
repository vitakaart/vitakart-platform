// File: apps/web/components/home/hero-slider.tsx
// Cinematic hero slider with image backgrounds

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Zap, CircleCheck, Truck, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    type: "main",
    tag: "Next-gen wellness delivery",
    title: "Feed your family the best wellness.",
    description: "Premium vitamins, ayurveda, and supplements delivered fast.",
    cta1: { label: "Shop Bestsellers", link: ROUTES.PRODUCTS },
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
    overlay: "from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-[#0A0A0A]/20",
  },
  {
    id: 2,
    type: "happy-hour",
    tag: "Happy Hour",
    title: "Flash deals for evening reset.",
    description: "Wellness shots, protein bars, and recovery kits.",
    cta1: { label: "Shop Now", link: "#" },
    image: "https://images.unsplash.com/photo-1579722821273-0f6c6f6a4b09?auto=format&fit=crop&w=1600&q=80",
    overlay: "from-[#F59E0B]/90 via-[#F59E0B]/60 to-[#F59E0B]/20",
  },
  {
    id: 3,
    type: "weekly",
    tag: "Weekly Discount",
    title: "Save up to 35% on essentials.",
    description: "Stack offers on multivitamins and omega 3.",
    cta1: { label: "Unlock Offer", link: "#" },
    code: "VITAWEEK",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=1600&q=80",
    overlay: "from-[#10B981]/90 via-[#10B981]/60 to-[#10B981]/20",
  },
];

// Side card slides
const SIDE_CARDS = [
  {
    tag: "Happy Hour",
    title: "Flash deals for your evening reset.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c6f6a4b09?auto=format&fit=crop&w=800&q=80",
    overlay: "from-[#F59E0B]/95 via-[#F59E0B]/70 to-[#F59E0B]/40",
    btnBg: "bg-white",
    btnText: "text-[#F59E0B]",
  },
  {
    tag: "Weekly Discount",
    title: "Save up to 35% on premium essentials.",
    cta: "Unlock Offer",
    code: "VITAWEEK",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=800&q=80",
    overlay: "from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-[#10B981]/40",
    btnBg: "bg-[#10B981]",
    btnText: "text-white",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ==========================================
           MOBILE VIEW — Cinematic Image Slider
           ========================================== */}
      <div
        className="lg:hidden relative overflow-hidden rounded-2xl shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[240px]">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />

              {/* Color Overlay */}
              <div className={cn("absolute inset-0 bg-gradient-to-br", slide.overlay)} />

              {/* Content */}
              <div className="relative h-full py-3 px-10 flex flex-col justify-between text-white">
                {/* Top */}
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold mb-3">
                    {slide.type === "main" && <Zap className="w-3 h-3" />}
                    {slide.tag}
                  </div>

                  <h1 className="text-2xl font-black leading-tight mb-2 max-w-[240px]">
                    {slide.title}
                  </h1>

                  <p className="text-xs text-white/90 leading-5 line-clamp-2 max-w-[280px]">
                    {slide.description}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    {slide.type === "weekly" && slide.code && (
                      <div className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-semibold w-fit">
                        Code: {slide.code}
                      </div>
                    )}
                    <Link
                      href={slide.cta1.link}
                      className="inline-flex items-center gap-1.5 h-9 rounded-full bg-white text-[#0A0A0A] px-4 text-xs font-bold transition-all duration-300 hover:scale-105 w-fit shadow-lg"
                    >
                      {slide.cta1.label}
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Features (only main) */}
                  {slide.type === "main" && (
                    <div className="flex flex-col gap-1 text-[10px] text-white/90">
                      <div className="flex items-center gap-1">
                        <CircleCheck className="w-3 h-3" />
                        Authentic
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        10 min delivery
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 text-[#0A0A0A]" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 text-[#0A0A0A]" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "transition-all duration-300 rounded-full",
                i === currentSlide
                  ? "w-6 h-1.5 bg-white shadow-md"
                  : "w-1.5 h-1.5 bg-white/60 hover:bg-white/80"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ==========================================
           DESKTOP VIEW — Cinematic Bento Grid
           ========================================== */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:grid-rows-2 gap-3 min-h-[380px]">
        {/* MAIN HERO — Cinematic */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm col-span-7 row-span-2 group">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80"
            alt="Premium wellness"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="60vw"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-[#0A0A0A]/20" />

          {/* Content */}
          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            <div className="max-w-md flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-semibold">
                <Zap className="w-3 h-3 text-[#10B981]" />
                Next-gen wellness delivery
              </div>

              <h1 className="text-3xl xl:text-4xl font-black leading-tight">
                Feed your family the best wellness, faster than ever.
              </h1>

              <p className="text-sm leading-6 text-white/80 max-w-sm">
                Premium vitamins, ayurveda, sports nutrition, and clean supplements.
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="h-10 rounded-xl bg-[#10B981] px-4 text-xs font-bold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-1.5"
                >
                  Shop Bestsellers
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  href={ROUTES.CATEGORIES}
                  className="h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 text-xs font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 flex items-center"
                >
                  Explore Categories
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-2 text-[10px] text-white/80">
                <div className="flex items-center gap-1">
                  <CircleCheck className="w-3 h-3 text-[#10B981]" />
                  Authentic brands
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#10B981]" />
                  10 min delivery
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* HAPPY HOUR — Cinematic */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm col-span-5 group">
          <Image
            src="https://images.unsplash.com/photo-1579722821273-0f6c6f6a4b09?auto=format&fit=crop&w=800&q=80"
            alt="Happy hour"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="40vw"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/95 via-[#F59E0B]/70 to-[#F59E0B]/40" />

          <div className="relative h-full p-5 flex flex-col justify-between text-white">
            <div>
              <div className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold">
                Happy Hour
              </div>
              <h2 className="mt-2 text-lg xl:text-xl font-bold leading-tight">
                Flash deals for your evening reset.
              </h2>
              <p className="mt-1 text-xs text-white/90 line-clamp-2">
                Wellness shots, protein bars, and recovery kits.
              </p>
            </div>
            <button className="h-9 rounded-full bg-white text-[#F59E0B] px-4 text-xs font-bold transition-all duration-300 hover:scale-105 shadow-lg w-fit flex items-center gap-1.5">
              Shop Now
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* WEEKLY DISCOUNT — Cinematic */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm col-span-5 group">
          <Image
            src="https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=800&q=80"
            alt="Weekly discount"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="40vw"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-[#10B981]/50" />

          <div className="relative h-full p-5 flex flex-col justify-between text-white">
            <div>
              <div className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold">
                Weekly Discount
              </div>
              <h2 className="mt-2 text-lg xl:text-xl font-bold leading-tight">
                Save up to 35% on premium essentials.
              </h2>
              <p className="mt-1 text-xs text-white/90 line-clamp-2">
                Stack offers on multivitamins, omega 3, and immunity boosters.
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1.5 text-[10px] font-semibold">
                Code: VITAWEEK
              </div>
              <button className="h-9 rounded-full bg-[#10B981] text-white px-4 text-xs font-bold transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center gap-1.5">
                Unlock
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}