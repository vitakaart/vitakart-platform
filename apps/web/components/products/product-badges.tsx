// File: apps/web/components/products/product-badges.tsx
// Product badges (Best Seller, Organic, Vegan, etc.)

import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

interface ProductBadgesProps {
  product: Product;
  className?: string;
}

export function ProductBadges({ product, className }: ProductBadgesProps) {
  const badges: { label: string; color: string }[] = [];

  // Auto-detect badges based on product data
  if (product.isFeatured) {
    badges.push({ label: "BEST SELLER", color: "bg-[#F59E0B] text-white" });
  }

  // Check for organic/vegan in description
  const desc = (product.description + " " + product.name).toLowerCase();
  
  if (desc.includes("organic")) {
    badges.push({ label: "ORGANIC", color: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" });
  }

  if (desc.includes("vegan")) {
    badges.push({ label: "VEGAN", color: "bg-purple-100 text-purple-700 border border-purple-200" });
  }

  if (product.stockQuantity < 10 && product.stockQuantity > 0) {
    badges.push({ label: "LOW STOCK", color: "bg-red-100 text-red-700 border border-red-200" });
  }

  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges.slice(0, 2).map((badge, i) => (
        <span
          key={i}
          className={cn(
            "text-[9px] font-bold px-2 py-1 rounded-md tracking-wider",
            badge.color
          )}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}