// File: apps/web/components/product-detail/quantity-selector.tsx
// Quantity selector with +/- buttons

"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

export function QuantitySelector({
  quantity,
  onChange,
  max = 99,
  min = 1,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="inline-flex items-center gap-1 border border-[#E9E1D2] rounded-full bg-[#FFFDF8] p-1">
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="min-w-[32px] text-center font-bold text-[#0A0A0A]">
        {quantity}
      </span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F1E8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}