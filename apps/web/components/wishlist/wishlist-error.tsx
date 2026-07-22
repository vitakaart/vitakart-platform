// File: apps/web/components/wishlist/wishlist-error.tsx
// Error state with retry

"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WishlistErrorProps {
  onRetry: () => void;
}

export function WishlistError({ onRetry }: WishlistErrorProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <p className="text-stone-900 font-semibold mb-1">Failed to load wishlist</p>
      <p className="text-sm text-stone-600 mb-4">Please try again</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
}