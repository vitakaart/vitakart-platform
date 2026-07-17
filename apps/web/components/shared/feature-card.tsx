// File: apps/web/components/shared/feature-card.tsx
// Reusable feature card (light & dark variants)

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  tag: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  variant?: "light" | "dark";
  compact?: boolean;
  className?: string;
}

export function FeatureCard({
  tag,
  title,
  subtitle,
  ctaLabel = "Shop Now",
  ctaLink = "#",
  variant = "light",
  compact = false,
  className,
}: FeatureCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "rounded-2xl relative overflow-hidden",
        isDark
          ? "bg-[#0A0A0A] p-4"
          : "bg-gradient-to-br from-[#10B981]/15 to-[#F59E0B]/15 p-4",
        compact ? "" : "p-5",
        className
      )}
    >
      {/* Dark overlay for dark variant */}
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] to-[#10B981]/30" />
      )}

      <div className={cn("relative z-10", compact ? "flex items-center justify-between gap-3" : "")}>
        <div className={cn("flex-1", isDark ? "text-white" : "")}>
          {/* Tag */}
          <div className={cn(
            "text-[10px] font-semibold uppercase tracking-wider mb-1",
            isDark ? "text-white/70" : "text-[#6B665D]"
          )}>
            {tag}
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-bold leading-tight",
            compact ? "text-lg" : "text-xl",
            isDark ? "text-white" : "text-[#0A0A0A]"
          )}>
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className={cn(
              "mt-1",
              compact ? "text-xs" : "text-sm",
              isDark ? "text-white/70" : "text-[#6B665D]"
            )}>
              {subtitle}
            </p>
          )}

          {/* CTA - Full button for non-compact */}
          {!compact && (
            <Link
              href={ctaLink}
              className={cn(
                "inline-flex items-center gap-1.5 mt-4 min-h-11 rounded-full px-4 py-3 text-xs font-bold transition-all duration-300 hover:scale-105",
                isDark
                  ? "bg-[#10B981] text-white"
                  : "bg-[#10B981] text-white"
              )}
            >
              {ctaLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Compact CTA button */}
        {compact && (
          <Link
            href={ctaLink}
            className="h-10 rounded-full bg-[#10B981] px-4 text-xs font-bold text-white transition-all duration-300 hover:scale-105 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
          >
            {ctaLabel}
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}