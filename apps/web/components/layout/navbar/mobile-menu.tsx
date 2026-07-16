// File: apps/web/components/layout/navbar/mobile-menu.tsx
// Fixed background, positioning, and content rendering

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Grid3x3,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  Settings,
  Trophy,
  User,
  X,
  Flame,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore, useIsHydrated } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAIN_LINKS = [
  { icon: Home, label: "Home", href: ROUTES.HOME },
  { icon: Grid3x3, label: "Categories", href: ROUTES.CATEGORIES },
  { icon: ShoppingBag, label: "All Products", href: ROUTES.PRODUCTS },
  { icon: Flame, label: "Deals & Offers", href: "#", badge: "HOT" },
  { icon: Sparkles, label: "New Arrivals", href: "#" },
  { icon: Trophy, label: "Best Sellers", href: "#" },
];

const ACCOUNT_LINKS = [
  { icon: Package, label: "My Orders", href: ROUTES.ORDERS },
  { icon: Heart, label: "Wishlist", href: ROUTES.WISHLIST },
  { icon: MapPin, label: "Addresses", href: ROUTES.ADDRESSES },
  { icon: User, label: "My Profile", href: ROUTES.PROFILE },
  { icon: Settings, label: "Settings", href: ROUTES.SETTINGS },
];

const SUPPORT_LINKS = [
  { icon: HelpCircle, label: "Help & Support", href: ROUTES.CONTACT },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const isHydrated = useIsHydrated();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  // ==========================================
  // LOCK BODY SCROLL WHEN MENU IS OPEN
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    clearAuth();
    onClose();
    router.push(ROUTES.HOME);
  };

  return (
    <div
      className="fixed inset-0 z-[100] md:hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* ==========================================
           BACKDROP — Dark overlay
           ========================================== */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* ==========================================
           MENU PANEL — Solid background
           ========================================== */}
      <aside
        className={cn(
          "absolute top-0 left-0 bottom-0",
          "w-[85%] max-w-sm",
          "bg-white",
          "shadow-2xl",
          "flex flex-col",
          "animate-slide-in-left"
        )}
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* HEADER */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Link
              href={ROUTES.HOME}
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Vitakart</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* USER PROFILE */}
        <div className="flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 border-b border-primary-200 p-4">
          {isHydrated && isAuthenticated && user ? (
            <Link
              href={ROUTES.ACCOUNT}
              onClick={onClose}
              className="flex items-center gap-3"
            >
              <div className="w-14 h-14 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-medium text-primary-700 bg-white px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-md">
                <User className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Welcome!</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Login for exclusive offers
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-white">
          <nav className="p-3">
            {/* Shop Section */}
            <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Shop
            </p>
            <div className="space-y-0.5">
              {MAIN_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <MenuLink
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    icon={<Icon className="w-5 h-5" />}
                    badge={link.badge}
                  >
                    {link.label}
                  </MenuLink>
                );
              })}
            </div>

            {/* Account Section */}
            {isHydrated && isAuthenticated && (
              <>
                <p className="px-3 py-2 mt-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  My Account
                </p>
                <div className="space-y-0.5">
                  {ACCOUNT_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <MenuLink
                        key={link.label}
                        href={link.href}
                        onClick={onClose}
                        icon={<Icon className="w-5 h-5" />}
                      >
                        {link.label}
                      </MenuLink>
                    );
                  })}
                </div>
              </>
            )}

            {/* Support Section */}
            <p className="px-3 py-2 mt-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Support
            </p>
            <div className="space-y-0.5">
              {SUPPORT_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <MenuLink
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    icon={<Icon className="w-5 h-5" />}
                  >
                    {link.label}
                  </MenuLink>
                );
              })}
            </div>

            {/* Logout */}
            {isHydrated && isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                    "text-danger-600 font-medium",
                    "hover:bg-danger-50 active:bg-danger-100",
                    "transition-colors"
                  )}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 mt-4 border-t border-gray-100 text-center bg-gray-50">
            <p className="text-xs text-gray-500 font-medium">Vitakart v1.0.0</p>
            <p className="text-[10px] text-gray-400 mt-1">
              Made with ❤️ for your wellness
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Menu link component
function MenuLink({
  href,
  onClick,
  icon,
  badge,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-xl",
        "text-gray-700 font-medium text-sm",
        "hover:bg-primary-50 hover:text-primary-700",
        "active:bg-primary-100",
        "transition-colors"
      )}
    >
      <span className="text-gray-500">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="text-[10px] font-bold text-white bg-accent-500 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}