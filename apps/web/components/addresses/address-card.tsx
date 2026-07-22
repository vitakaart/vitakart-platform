// File: apps/web/components/addresses/address-card.tsx
// Single address display card with actions

"use client";

import {
  Briefcase,
  Home,
  MapPin,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/api";
import { AddressType } from "@/types/api";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault,
}: AddressCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Icon based on address type
  const TypeIcon =
    address.type === AddressType.Home
      ? Home
      : address.type === AddressType.Office
        ? Briefcase
        : MapPin;

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl border p-5 transition-all",
        address.isDefault
          ? "border-primary-200 shadow-sm ring-1 ring-primary-100"
          : "border-stone-100 hover:border-stone-200"
      )}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute -top-2 left-4 flex items-center gap-1 bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-current" />
          Default
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              address.isDefault
                ? "bg-primary-50 text-primary-600"
                : "bg-stone-100 text-stone-600"
            )}
          >
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">{address.fullName}</h3>
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              {address.type}
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="w-4 h-4 text-stone-500" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 top-full mt-1 bg-white border border-stone-100 rounded-xl shadow-lg py-1 min-w-[140px] z-20 animate-fade-in">
                <button
                  onClick={() => {
                    onEdit(address);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>

                {!address.isDefault && (
                  <button
                    onClick={() => {
                      onSetDefault(address);
                      setMenuOpen(false);
                    }}
                    disabled={isSettingDefault}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
                  >
                    <Star className="w-4 h-4" />
                    Set Default
                  </button>
                )}

                <button
                  onClick={() => {
                    onDelete(address);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="text-sm text-stone-600 leading-relaxed pl-13">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        {address.landmark && (
          <p className="text-stone-500">Landmark: {address.landmark}</p>
        )}
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-stone-500">{address.country}</p>
      </div>

      {/* Phone */}
      <div className="mt-3 pt-3 border-t border-stone-100">
        <p className="text-sm text-stone-600">
          <span className="text-stone-400 text-xs">Phone: </span>
          {address.phone}
        </p>
      </div>
    </div>
  );
}