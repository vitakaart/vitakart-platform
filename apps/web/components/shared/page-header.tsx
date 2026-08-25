// File: apps/web/components/shared/page-header.tsx
// Reusable page header — use whatever props you need

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  // Required
  title: string;

  // Optional content
  subtitle?: string;
  description?: string;
  badge?: string | number;
  badgeColor?: "green" | "orange" | "red" | "blue" | "gray";

  // Navigation
  backHref?: string;
  showBack?: boolean;
  breadcrumbs?: BreadcrumbItem[];

  // Right side
  action?: React.ReactNode;

  // Icon
  icon?: React.ReactNode;

  // Styling
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const BADGE_COLORS = {
  green: "bg-[#10B981]/10 text-[#10B981]",
  orange: "bg-[#F59E0B]/10 text-[#F59E0B]",
  red: "bg-red-500/10 text-red-500",
  blue: "bg-blue-500/10 text-blue-500",
  gray: "bg-[#6B665D]/10 text-[#6B665D]",
};

const TITLE_SIZES = {
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-3xl",
};

export function PageHeader({
  title,
  subtitle,
  description,
  badge,
  badgeColor = "green",
  backHref,
  showBack = false,
  breadcrumbs,
  action,
  icon,
  size = "md",
  className,
  children,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-[#6B665D]">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={index} className="flex items-center gap-1">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-[#10B981]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        isLast && "font-medium text-[#0A0A0A]"
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}

                  {!isLast && (
                    <ChevronRight className="h-3 w-3 flex-shrink-0 text-[#E9E1D2]" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Main Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Left Side */}
        <div className="flex items-start gap-3">
          {/* Back Button */}
          {showBack && (
            <button
              onClick={handleBack}
              className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#E9E1D2] transition-all hover:border-[#10B981] hover:bg-[#10B981] hover:text-white lg:h-9 lg:w-9"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          {/* Icon */}
          {icon && (
            <div className="mt-0.5 flex-shrink-0">
              {icon}
            </div>
          )}

          {/* Text Content */}
          <div className="flex flex-col">
            {/* Subtitle (above title) */}
            {subtitle && (
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                {subtitle}
              </div>
            )}

            {/* Title + Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className={cn(
                  "font-serif font-normal italic text-[#1A3C34] ",
                  TITLE_SIZES[size]
                )}
              >
                {title}
              </h1>

              {badge !== undefined && badge !== null && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                    BADGE_COLORS[badgeColor]
                  )}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Description (below title) */}
            {description && (
              <p className="mt-1 text-sm text-[#6B665D]">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side — Action */}
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Children — Extra content below header */}
      {children && <div>{children}</div>}
    </div>
  );
}