// apps/web/app/account/wishlist/page.tsx
// Wishlist page — Clean orchestrator with AccountLayout

"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AccountLayout } from "@/components/account/account-layout";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";
import { WishlistLoading } from "@/components/wishlist/wishlist-loading";
import { WishlistEmpty } from "@/components/wishlist/wishlist-empty";
import { WishlistError } from "@/components/wishlist/wishlist-error";
import { ClearWishlistModal } from "@/components/wishlist/clear-wishlist-modal";
import {
  useMyWishlist,
  useClearWishlist,
} from "@/lib/hooks/use-wishlist";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

function WishlistContent() {
  const { data: wishlist, isLoading, isError, refetch } = useMyWishlist();
  const clearMutation = useClearWishlist();
  const [showClearModal, setShowClearModal] = useState(false);

  const totalItems = wishlist?.length ?? 0;
  const inStockItems = wishlist?.filter((item) => item.inStock).length ?? 0;

  const handleClearAll = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
        setShowClearModal(false);
      },
    });
  };

  const renderContent = () => {
    if (isLoading) return <WishlistLoading />;
    if (isError) return <WishlistError onRetry={refetch} />;
    if (!wishlist || wishlist.length === 0) return <WishlistEmpty />;
    return <WishlistGrid items={wishlist} />;
  };

  // Build subtitle based on state
  const subtitle = (() => {
    if (isLoading) return "Loading your saved items...";
    if (totalItems === 0) return "Your saved wellness items appear here";
    if (inStockItems === totalItems) {
      return `${totalItems} ${totalItems === 1 ? "item" : "items"} saved · all in stock`;
    }
    return `${totalItems} ${totalItems === 1 ? "item" : "items"} saved · ${inStockItems} in stock`;
  })();

  return (
    <>
      {/* Page header with clear action */}
      <AccountPageHeader
        title="Wishlist"
        subtitle={subtitle}
        backHref={ROUTES.ACCOUNT}
        action={
          totalItems > 0 ? (
              <Button
              onClick={() => setShowClearModal(true)}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 " />
              Clear All
            </Button>
          ) : null
        }
      />

      {/* Content */}
      {renderContent()}

      {/* Clear Confirmation Modal */}
      <ClearWishlistModal
        isOpen={showClearModal}
        itemCount={totalItems}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        isClearing={clearMutation.isPending}
      />
    </>
  );
}

export default function WishlistPage() {
  return (
    <AccountLayout>
      <WishlistContent />
    </AccountLayout>
  );
}