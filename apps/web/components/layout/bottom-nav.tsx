// File: apps/web/components/layout/bottom-nav.tsx
// Smooth mobile bottom navigation — no blink on route change

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Grid3x3, 
  Heart, 
  Home, 
  ShoppingCart, 
  User
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useCart } from "@/lib/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: ROUTES.HOME },
  { icon: Grid3x3, label: "Shop", href: ROUTES.CATEGORIES },
  { icon: ShoppingCart, label: "Cart", href: ROUTES.CART, isCenter: true },
  { icon: Heart, label: "Wishlist", href: ROUTES.WISHLIST },
  { icon: User, label: "Profile", href: ROUTES.ACCOUNT },
];

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount: cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Prevent hydration mismatch and initial animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent flash
  if (!mounted) {
    return <div className="h-20 md:hidden" />;
  }

  return (
    <>
      <div className="h-20 md:hidden" />
      
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "md:hidden",
          "bg-white/90 backdrop-blur-xl",
          "border-t border-gray-100",
          "shadow-[0_-4px_20px_rgba(0,0,0,0.05)]",
          "safe-bottom"
        )}
      >
        <div className="relative flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isCenter = item.isCenter;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  isCenter ? "-mt-6" : "w-16 h-full"
                )}
                prefetch={false} // Prevents prefetch flash
              >
                {isCenter ? (
                  // Center Cart Button — static, no layoutId
                  <div
                    className={cn(
                      "relative flex items-center justify-center",
                      "w-14 h-14 rounded-2xl",
                      "bg-gradient-to-br from-primary-500 to-primary-600",
                      "shadow-lg shadow-primary-500/30",
                      "border-4 border-white",
                      "transition-transform active:scale-95",
                      isActive && "shadow-xl shadow-primary-500/40"
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    
                    {/* Cart Badge — only animate on count change, not route */}
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                ) : (
                  // Regular Items — smooth color transition only
                  <div className="relative flex flex-col items-center gap-1">
                    {/* Active Background Pill — CSS only, no layoutId */}
                    <div
                      className={cn(
                        "absolute -top-2 w-12 h-12 rounded-2xl bg-primary-50 -z-10",
                        "transition-all duration-300 ease-out",
                        isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      )}
                    />
                    
                    <div
                      className={cn(
                        "transition-all duration-300",
                        isActive ? "scale-110 -translate-y-0.5" : "scale-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-6 h-6 transition-colors duration-300",
                          isActive ? "text-primary-600" : "text-gray-400"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    
                    <span
                      className={cn(
                        "text-[11px] font-medium transition-all duration-300",
                        isActive 
                          ? "text-primary-700 font-bold opacity-100" 
                          : "text-gray-400 opacity-80"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}