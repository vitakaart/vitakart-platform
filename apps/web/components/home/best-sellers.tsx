// File: apps/web/components/home/best-sellers.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => productsApi.getFeatured(6),
    staleTime: 5 * 60 * 1000,
  });

  const products = data ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A0A0A]">Best sellers</h2>
          <p className="text-sm text-[#6B665D]">Small compact cards designed for speed and scanability.</p>
        </div>
        <Link href={ROUTES.PRODUCTS} className="hidden text-sm font-semibold text-[#10B981] md:block hover:underline">
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
      </div>
    </section>
  );
}