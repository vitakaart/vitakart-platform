// File: apps/web/components/layout/navbar/desktop-nav.tsx
// Desktop navbar — cleaned search bar without category dropdown

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlistCount } from "@/lib/hooks/use-wishlist";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore, useIsHydrated } from "@/lib/stores/auth-store";
import { MegaMenu } from "./mega-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function DesktopNav() {
  const router = useRouter();
  const isHydrated = useIsHydrated();
  const { isAuthenticated, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount: cartItemCount } = useCart();
  const openCartDrawer = useCartStore((state) => state.open);

  const { data: wishlistData } = useWishlistCount();
  const wishlistCount = wishlistData?.count ?? 0;
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="hidden md:flex flex-col">
      {/* Top Row: Logo + Search + Actions */}
      <div className="flex items-center justify-between h-18 gap-4">
        {/* Left: Logo + Catalog */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            {/* <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary-500/20"> */}
            <Image src="/logos/vitakart-animated-logo (1).gif" alt="" width={100} height={100} />
            {/* </div> */}

          </Link>

          {/* Catalog Button with Mega Menu */}
          <MegaMenu />
        </div>

        {/* Center: Clean Search Bar (No Category Dropdown) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <Input
              type="search"
              placeholder="Search for vitamins, supplements, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 rounded-xl transition-all"
            />
            {/* Optional: Search button inside input on right */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-500 text-white opacity-0 group-focus-within:opacity-100 hover:bg-primary-600 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            href={ROUTES.WISHLIST}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors relative group"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => openCartDrawer()}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors relative group"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>

          <div className="w-px h-8 bg-gray-200 mx-2" />

          {/* User Menu */}
          {isHydrated && isAuthenticated && user ? (
            <Link
              href={ROUTES.ACCOUNT}
              className="flex items-center gap-3 ml-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.fullName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs text-gray-500">Hello,</p>
                <p className="text-sm font-semibold text-gray-900 -mt-0.5">
                  {user.fullName.split(" ")[0]}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium"
                onClick={() => router.push(ROUTES.LOGIN)}
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router.push(ROUTES.REGISTER)}
                className="bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}