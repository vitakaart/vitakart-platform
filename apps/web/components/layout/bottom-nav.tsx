// File: apps/web/components/layout/bottom-nav.tsx
// Mobile bottom navigation — FIXED positioning

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3x3, Heart, Home, ShoppingCart, User } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: ROUTES.HOME },
  { icon: Grid3x3, label: "Categories", href: ROUTES.CATEGORIES },
  { icon: ShoppingCart, label: "Cart", href: ROUTES.CART, badge: 0 },
  { icon: Heart, label: "Wishlist", href: ROUTES.WISHLIST },
  { icon: User, label: "Account", href: ROUTES.ACCOUNT },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "md:hidden",
        "bg-white border-t border-gray-200",
        "shadow-[0_-2px_10px_rgba(0,0,0,0.05)]",
        "safe-bottom"
      )}
    >
      <div className="grid grid-cols-5 h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "transition-colors relative",
                "active:bg-gray-50",
                isActive
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full" />
              )}

              {/* Icon with badge */}
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-accent-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}