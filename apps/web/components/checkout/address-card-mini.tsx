// File: apps/web/components/checkout/address-card-mini.tsx
// Compact address card for checkout selection

"use client";

import { Briefcase, Home, MapPin, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/api";
import { AddressType } from "@/types/api";

interface AddressCardMiniProps {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}

export function AddressCardMini({
  address,
  selected,
  onSelect,
}: AddressCardMiniProps) {
  const TypeIcon =
    address.type === AddressType.Home
      ? Home
      : address.type === AddressType.Office
        ? Briefcase
        : MapPin;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
        selected
          ? "border-primary-500 bg-primary-50/50 shadow-md shadow-primary-100"
          : "border-[#E9E1D2] bg-white hover:border-primary-200 hover:shadow-sm"
      )}
    >
      {/* Selected Checkmark */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Default Badge */}
      {address.isDefault && !selected && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Star className="w-2.5 h-2.5 fill-current" />
          DEFAULT
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            selected
              ? "bg-primary-500 text-white"
              : "bg-primary-100 text-primary-600"
          )}
        >
          <TypeIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0A0A0A]">{address.fullName}</p>
          <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">
            {address.type}
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="text-xs text-[#6B665D] leading-relaxed space-y-0.5">
        <p>
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </p>
        {address.landmark && (
          <p className="text-[#6B665D]/70">Landmark: {address.landmark}</p>
        )}
        <p>
          {address.city}, {address.state} - <strong>{address.pincode}</strong>
        </p>
        <p className="text-[#6B665D]/70 pt-1">📞 {address.phone}</p>
      </div>
    </button>
  );
}