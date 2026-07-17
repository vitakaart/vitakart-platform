// File: apps/web/components/categories/bento-banner-card.tsx
// Reusable banner card with image background

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoBannerCardProps {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  overlay: string;
  size?: "large" | "small";
  tag?: string;
  className?: string;
}

export function BentoBannerCard({
  title,
  subtitle,
  cta,
  href,
  image,
  overlay,
  size = "small",
  tag,
  className,
}: BentoBannerCardProps) {
  const isLarge = size === "large";

  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all",
        isLarge ? "min-h-[280px]" : "min-h-[180px]",
        className
      )}
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
        sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
      />

      {/* Color Overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-r", overlay)} />

      {/* Content */}
      <div
        className={cn(
          "relative h-full flex flex-col justify-between text-white",
          isLarge ? "p-6 md:p-8" : "p-5"
        )}
      >
        <div>
          {/* Tag (only for large) */}
          {isLarge && tag && (
            <div className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3">
              {tag}
            </div>
          )}

          {/* Title */}
          <h3
            className={cn(
              "font-bold leading-tight",
              isLarge ? "text-2xl md:text-4xl mb-2 max-w-md" : "text-xl md:text-2xl mb-1"
            )}
          >
            {title}
          </h3>

          {/* Subtitle */}
          <p
            className={cn(
              "text-white/80",
              isLarge ? "text-sm md:text-base max-w-sm" : "text-xs md:text-sm"
            )}
          >
            {subtitle}
          </p>
        </div>

        {/* CTA Button */}
        <button
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-white text-[#0A0A0A] font-bold w-fit hover:gap-3 transition-all",
            isLarge ? "h-11 px-6 text-sm" : "h-9 px-4 text-xs"
          )}
        >
          {cta}
          <ArrowUpRight className={isLarge ? "w-4 h-4" : "w-3 h-3"} />
        </button>
      </div>
    </Link>
  );
}