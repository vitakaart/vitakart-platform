// File: apps/web/components/shared/empty-state.tsx
// Reusable empty state for all sections

import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EmptyState({
  icon,
  title = "Nothing here yet",
  description = "Check back soon!",
  size = "md",
  className,
}: EmptyStateProps) {
  const sizes = {
    sm: {
      container: "p-6",
      icon: "text-3xl mb-2",
      title: "text-sm",
      description: "text-xs",
    },
    md: {
      container: "p-8",
      icon: "text-4xl mb-2",
      title: "text-sm",
      description: "text-xs",
    },
    lg: {
      container: "p-12",
      icon: "text-5xl mb-3",
      title: "text-base",
      description: "text-sm",
    },
  };

  const s = sizes[size];

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] text-center",
        s.container,
        className
      )}
    >
      {/* Icon */}
      <div className={s.icon}>
        {icon || "📦"}
      </div>

      {/* Title */}
      <p className={cn("text-[#0A0A0A] font-semibold", s.title)}>
        {title}
      </p>

      {/* Description */}
      {description && (
        <p className={cn("text-[#6B665D] mt-1", s.description)}>
          {description}
        </p>
      )}
    </div>
  );
}