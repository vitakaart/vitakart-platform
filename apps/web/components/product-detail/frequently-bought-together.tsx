// File: apps/web/components/product-detail/frequently-bought-together.tsx
// Bundle products together with total price

"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/api";

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  bundleProducts?: Product[];
}

export function FrequentlyBoughtTogether({
  mainProduct,
  bundleProducts = [],
}: FrequentlyBoughtTogetherProps) {
  // Combine main + bundle
  const allProducts = [mainProduct, ...bundleProducts.slice(0, 2)];

  // Calculate total
  const total = allProducts.reduce((sum, p) => {
    return sum + (p.discountPrice ?? p.price);
  }, 0);

  const originalTotal = allProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = originalTotal - total;

  const handleAddBundle = () => {
    toast.success(`Bundle added to cart! You saved ₹${savings.toLocaleString("en-IN")}`);
  };

  return (
    <div>
      {/* Header */}
      <h3 className="text-lg md:text-xl font-bold text-[#0A0A0A] mb-4">
        Frequently Bought Together
      </h3>

      {/* Bundle Card */}
      <div className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Product Images */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {allProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-2">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#F5F1E8]  flex items-center justify-center relative">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover  rounded-2xl"
                      sizes="80px"
                    />
                  ) : (
                    <div className="text-2xl">📦</div>
                  )}
                </div>
                {i < allProducts.length - 1 && (
                  <Plus className="w-4 h-4 text-[#6B665D]" />
                )}
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h4 className="text-base md:text-lg font-bold text-[#0A0A0A]">
              Total Immunity Bundle
            </h4>
            <p className="text-xs text-[#6B665D] mt-1">
              {allProducts.map((p) => p.name.split(" ")[0]).join(" + ")}
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col md:items-end w-full md:w-auto">
            <div className="flex md:flex-col items-baseline md:items-end gap-2">
              <span className="text-2xl font-black text-red-600">
                ₹{total.toLocaleString("en-IN")}
              </span>
              {savings > 0 && (
                <span className="text-sm text-[#6B665D] line-through">
                  ₹{originalTotal.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="text-xs text-[#10B981] font-semibold mt-1">
                Save ₹{savings.toLocaleString("en-IN")}
              </div>
            )}
          </div>

          {/* Add Bundle Button */}
          <button
            onClick={handleAddBundle}
            className="w-full md:w-auto h-11 md:h-12 px-6 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold shadow-md transition-all hover:scale-105"
          >
            Add Bundle
          </button>
        </div>
      </div>
    </div>
  );
}