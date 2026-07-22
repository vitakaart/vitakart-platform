// File: apps/web/components/wishlist/wishlist-grid.tsx
// Grid layout for wishlist items

"use client";

import { WishlistItemCard } from "./wishlist-item-card";
import type { WishlistItem } from "@/types/api";

interface WishlistGridProps {
  items: WishlistItem[];
}

export function WishlistGrid({ items }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}