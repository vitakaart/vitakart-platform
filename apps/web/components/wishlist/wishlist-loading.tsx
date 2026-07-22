// File: apps/web/components/wishlist/wishlist-loading.tsx
// Loading skeleton grid

"use client";

export function WishlistLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#E9E1D2] bg-white overflow-hidden animate-pulse">
      {/* Mobile: horizontal */}
      <div className="flex sm:hidden gap-3 p-3">
        <div className="w-24 h-24 bg-[#F5F1E8] rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-[#F5F1E8] rounded" />
          <div className="h-4 w-full bg-[#F5F1E8] rounded" />
          <div className="h-5 w-24 bg-[#F5F1E8] rounded" />
          <div className="h-8 w-full bg-[#F5F1E8] rounded" />
        </div>
      </div>

      {/* Desktop: vertical */}
      <div className="hidden sm:block">
        <div className="aspect-[3/2] bg-[#F5F1E8]" />
        <div className="p-4 space-y-2">
          <div className="h-3 w-20 bg-[#F5F1E8] rounded" />
          <div className="h-4 w-full bg-[#F5F1E8] rounded" />
          <div className="h-5 w-24 bg-[#F5F1E8] rounded" />
          <div className="h-10 w-full bg-[#F5F1E8] rounded" />
        </div>
      </div>
    </div>
  );
}