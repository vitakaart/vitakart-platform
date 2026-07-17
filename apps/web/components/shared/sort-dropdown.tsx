// File: apps/web/components/shared/sort-dropdown.tsx
// Reusable sort dropdown

"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function SortDropdown({ options, value, onChange, label = "Sort By" }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E9E1D2] bg-[#FFFDF8] text-sm font-medium text-[#0A0A0A] hover:border-[#10B981] transition-all"
      >
        <span className="text-[#6B665D]">{label}:</span>
        <span className="font-semibold">{selectedOption?.label || "Select"}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E9E1D2] bg-[#FFFDF8] shadow-lg z-30 overflow-hidden animate-fade-in">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-3 text-left text-sm hover:bg-[#F5F1E8] transition-colors",
                value === option.value && "bg-[#10B981]/10 text-[#10B981] font-semibold"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}