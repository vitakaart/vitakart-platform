// File: apps/web/components/shared/view-toggle.tsx
// Grid/List view toggle

"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-[#E9E1D2] bg-[#FFFDF8] p-1">
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
          view === "grid"
            ? "bg-[#10B981] text-white"
            : "text-[#6B665D] hover:text-[#0A0A0A]"
        )}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
          view === "list"
            ? "bg-[#10B981] text-white"
            : "text-[#6B665D] hover:text-[#0A0A0A]"
        )}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}