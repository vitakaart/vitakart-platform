// File: apps/web/components/layout/navbar/mobile-header.tsx
// Enhanced mobile header — clean, functional, premium feel

"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCart } from "@/lib/hooks/use-cart";
import { cn } from "@/lib/utils";

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
  const { itemCount: cartCount } = useCart();

  return (
    <div className="flex items-center justify-between h-16 md:hidden">
      {/* Left: Menu Toggle + Logo */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuToggle}
          className={cn(
            "p-2.5 -ml-2 rounded-xl transition-colors",
            isMenuOpen ? "bg-stone-100 text-stone-900" : "hover:bg-stone-100 text-stone-700"
          )}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="w-6 h-6" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <Link 
          href={ROUTES.HOME} 
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-stone-900 tracking-tight">
            Vitakart
          </span>
        </Link>
      </div>

      {/* Right: Action Icons */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSearchOpen}
          className="p-2.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" strokeWidth={2} />
        </motion.button>

        {/* Cart with Actual Badge */}
        <Link
          href={ROUTES.CART}
          className="relative p-2.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" strokeWidth={2} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute top-1 right-1 bg-accent-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm border-2 border-white"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Account */}
        <Link
          href={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
          className={cn(
            "p-2.5 rounded-xl transition-colors",
            isAuthenticated 
              ? "text-primary-600 hover:bg-primary-50" 
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          )}
          aria-label={isAuthenticated ? "My account" : "Login"}
        >
          <User className="w-5 h-5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}