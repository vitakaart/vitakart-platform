// File: apps/web/components/shared/section-header.tsx
// Reusable section header with tag, title, subtitle & arrow

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  href?: string;
  arrowLabel?: string;
  className?: string;
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  href,
  arrowLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between", className)}>
      <div>
        {/* Tag */}
        {tag && (
          <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-1">
            {tag}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-[#6B665D] mt-1 hidden md:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Arrow Button */}
      {href && (
        <Link
          href={href}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-[#E9E1D2] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all group flex-shrink-0"
          aria-label={arrowLabel}
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}