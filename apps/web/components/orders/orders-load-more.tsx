"use client";

import { RefObject } from "react";

interface Props {
  loadMoreRef: RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export function OrdersLoadMore({
  loadMoreRef,
  isFetchingNextPage,
  hasNextPage,
}: Props) {
  return (
    <>
      {isFetchingNextPage && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-[#E9E1D2]" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-[#6B665D] font-medium">
            Loading more orders...
          </p>
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-4" />
      )}
    </>
  );
}