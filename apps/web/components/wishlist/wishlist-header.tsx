// File: apps/web/components/wishlist/wishlist-header.tsx
// Header with title, count, and clear button

"use client";

import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WishlistHeaderProps {
  totalItems: number;
  inStockItems: number;
  onClearClick: () => void;
}

export function WishlistHeader({
  totalItems,
  inStockItems,
  onClearClick,
}: WishlistHeaderProps) {
  const getSubtitle = () => {
    if (totalItems === 0) {
      return "Save your favorite products for later";
    }

    const itemsText = `${totalItems} item${totalItems !== 1 ? "s" : ""} saved`;
    const stockText =
      inStockItems !== totalItems ? ` • ${inStockItems} in stock` : "";

    return `${itemsText}${stockText}`;
  };

  return (
    <div className="flex items-start align-items justify-between mb-6 gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
            My Wishlist
          </h1>
          <p className="text-sm text-stone-600">{getSubtitle()}</p>
        </div>
      </div>

      {totalItems > 0 && (
        <Button
          onClick={onClearClick}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      )}
    </div>
  );
}