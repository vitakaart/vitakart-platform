// File: apps/web/components/layout/navbar/desktop-nav.tsx
// Desktop navbar — logo + search + actions

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore, useIsHydrated } from "@/lib/stores/auth-store";

export function DesktopNav() {
  const router = useRouter();
  const isHydrated = useIsHydrated();
  const { isAuthenticated, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="hidden md:flex items-center justify-between h-20">
      {/* Logo */}
      <Link href={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">Vitakart</span>
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={ROUTES.WISHLIST}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5" />
        </Link>

        <Link
          href={ROUTES.CART}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          aria-label="Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            0
          </span>
        </Link>

        {/* User Menu */}
        {isHydrated && isAuthenticated && user ? (
          <Link
            href={ROUTES.ACCOUNT}
            className="flex items-center gap-2 ml-2 pl-2 px-3 py-2 border-l border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden lg:block">
              {user.fullName.split(" ")[0]}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-primary-600 hover:text-white"
              onClick={() => router.push(ROUTES.LOGIN)}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(ROUTES.REGISTER)}
              className="bg-primary-500 hover:bg-primary-600"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}