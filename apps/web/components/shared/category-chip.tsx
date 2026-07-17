// File: apps/web/components/shared/category-chip.tsx
// Reusable category chip for filters

import { cn } from "@/lib/utils";

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryChip({
  label,
  active = false,
  onClick,
  className,
}: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
        active
          ? "bg-[#0A0A0A] text-white"
          : "bg-[#F5F1E8] text-[#6B665D] hover:bg-[#0A0A0A] hover:text-white",
        className
      )}
    >
      {label}
    </button>
  );
}