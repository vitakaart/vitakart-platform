// File: apps/web/components/product-detail/pack-size-selector.tsx
// Pack size selector

"use client";

import { cn } from "@/lib/utils";

interface PackSize {
  label: string;
  value: string;
  price?: number;
}

interface PackSizeSelectorProps {
  sizes: PackSize[];
  selected: string;
  onChange: (value: string) => void;
}

export function PackSizeSelector({ sizes, selected, onChange }: PackSizeSelectorProps) {
  return (
    <div>
      <div className="text-sm font-semibold text-[#0A0A0A] mb-3">Select Pack Size</div>
      <div className="grid grid-cols-2 gap-3">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => onChange(size.value)}
            className={cn(
              "px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all",
              selected === size.value
                ? "border-[#10B981] bg-[#10B981]/5 text-[#10B981]"
                : "border-[#E9E1D2] bg-[#FFFDF8] text-[#0A0A0A] hover:border-[#10B981]/50"
            )}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}