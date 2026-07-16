// File: apps/web/components/layout/navbar/mobile-header.tsx
// Mobile top header — hamburger + logo + action icons

"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore } from "@/lib/stores/auth-store";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onSearchOpen: () => void;
}

export function MobileHeader({
  isMenuOpen,
  onMenuToggle,
  onSearchOpen,
}: MobileHeaderProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex items-center justify-between h-14 md:hidden">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Vitakart</span>
        </Link>
      </div>

      {/* Right: Action Icons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSearchOpen}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <Link
          href={ROUTES.CART}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          aria-label="Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute top-0 right-0 bg-accent-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </Link>

        <Link
          href={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Account"
        >
          <User className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}