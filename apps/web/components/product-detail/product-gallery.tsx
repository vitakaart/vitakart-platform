// File: apps/web/components/product-detail/product-gallery.tsx
// Compact gallery — smaller image + thumbnails visible together

"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isBestSeller?: boolean;
}

export function ProductGallery({ images, productName, isBestSeller = false }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="space-y-3">
      {/* Main Image — Reduced from aspect-square to aspect-[4/5] for less height */}
      <div className="relative aspect-[7/5] max-h-[500px] rounded-2xl bg-[#F5F1E8] overflow-hidden border border-[#E9E1D2]">
        {/* Best Seller Badge */}
        {isBestSeller && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#10B981] text-white text-[10px] font-bold rounded-full shadow-md">
              BEST SELLER
            </span>
          </div>
        )}

        <Image
          src={displayImages[selectedImage]}
          alt={productName}
          fill
          className="object-contain p-6 hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 40vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2 md:grid-cols-8">
          {displayImages.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                selectedImage === i
                  ? "border-[#10B981] shadow-md"
                  : "border-[#E9E1D2] hover:border-[#10B981]/50"
              )}
            >
              <Image
                src={img}
                alt={`${productName} view ${i + 1}`}
                fill
                className="object-contain p-2"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}