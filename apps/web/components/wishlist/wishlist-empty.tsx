// File: apps/web/components/wishlist/wishlist-empty.tsx
// Empty wishlist state

"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/lib/constants/routes";

export function WishlistEmpty() {
  return (
    <div>
      <EmptyState
        icon={<Heart className="w-12 h-12 text-red-400 mx-auto" />}
        title="Your wishlist is empty"
        description="Save products you love to buy them later"
        size="lg"
      />
      <div className="mt-4 flex justify-center">
        <Link href={ROUTES.PRODUCTS}>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white h-11">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}