// File: apps/web/components/addresses/form/address-type-selector.tsx
// Home/Office/Other selector buttons

"use client";

import { Briefcase, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddressType } from "@/types/api";

interface AddressTypeSelectorProps {
  value: AddressType;
  onChange: (type: AddressType) => void;
}

const TYPE_OPTIONS = [
  { value: AddressType.Home, label: "Home", icon: Home },
  { value: AddressType.Office, label: "Office", icon: Briefcase },
  { value: AddressType.Other, label: "Other", icon: MapPin },
];

export function AddressTypeSelector({
  value,
  onChange,
}: AddressTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-700">
        Address Type
      </label>
      <div className="grid grid-cols-3 gap-2">
        {TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                selected
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-stone-200 hover:border-stone-300 text-stone-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}