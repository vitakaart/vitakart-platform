// File: apps/web/components/wishlist/wishlist-button.tsx
// Reusable heart button for products (used everywhere)

"use client";

import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useIsInWishlist, useToggleWishlist } from "@/lib/hooks/use-wishlist";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  className?: string;
  onToggle?: (isInWishlist: boolean) => void;
}

export function WishlistButton({
  productId,
  variant = "icon",
  size = "md",
  className,
  onToggle,
}: WishlistButtonProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInWishlist = useIsInWishlist(productId);
  const toggleMutation = useToggleWishlist();

  const handleClick = (e: React.MouseEvent) => {
    // Prevent link/card click when button is inside a link
    e.preventDefault();
    e.stopPropagation();

    // If not logged in → redirect to login
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    toggleMutation.mutate(productId, {
      onSuccess: (data) => {
        onToggle?.(data.isInWishlist);
      },
    });
  };

  const isPending = toggleMutation.isPending;

  // ==========================================
  // ICON VARIANT (for product cards)
  // ==========================================
  if (variant === "icon") {
    const sizeMap = {
      sm: { button: "w-8 h-8", icon: "w-4 h-4" },
      md: { button: "w-10 h-10", icon: "w-5 h-5" },
      lg: { button: "w-12 h-12", icon: "w-6 h-6" },
    };

    const sizes = sizeMap[size];

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-200",
          "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg",
          "hover:scale-110 active:scale-95",
          isInWishlist
            ? "text-red-500 hover:bg-red-50"
            : "text-stone-600 hover:text-red-500 hover:bg-white",
          isPending && "opacity-60 cursor-wait",
          sizes.button,
          className
        )}
      >
        {isPending ? (
          <Loader2 className={cn(sizes.icon, "animate-spin")} />
        ) : (
          <Heart
            className={cn(
              sizes.icon,
              "transition-all duration-200",
              isInWishlist && "fill-current"
            )}
          />
        )}
      </button>
    );
  }

  // ==========================================
  // BUTTON VARIANT (for product detail page)
  // ==========================================
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-200",
        isInWishlist
          ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-stone-200 bg-white text-stone-700 hover:border-red-300 hover:text-red-500",
        isPending && "opacity-60 cursor-wait",
        className
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
          {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </>
      )}
    </button>
  );
}