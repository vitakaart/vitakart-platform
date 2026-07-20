// File: apps/web/components/layout/navbar/mobile-menu.tsx
// Enhanced with accordion categories

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  ChevronRight,
  ChevronDown,
  Search,
  Leaf,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthStore, useIsHydrated } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";
import { MEGA_MENU_DATA } from "@/lib/data/mega-menu";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAIN_LINKS = [
  { icon: Home, label: "Home", href: ROUTES.HOME },
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setExpandedCategory(null);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Menu Panel */}
      <aside className="absolute top-0 left-0 bottom-0 w-[90%] max-w-[380px] bg-white shadow-2xl flex flex-col animate-slide-in-left">

        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <Link href={ROUTES.HOME} onClick={onClose} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Vitakart</span>
            </Link>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-200" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/70 focus:bg-white/30 focus:outline-none transition-colors text-sm"
            />
          </form>
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 bg-primary-50 border-b border-primary-100 p-4">
          {isHydrated && isAuthenticated && user ? (
            <Link href={ROUTES.ACCOUNT} onClick={onClose} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Welcome to Vitakart!</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => { onClose(); router.push(ROUTES.LOGIN); }}
                    className="text-xs font-semibold text-primary-700 bg-primary-100 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onClose(); router.push(ROUTES.REGISTER); }}
                    className="text-xs font-semibold text-white bg-primary-500 px-3 py-1 rounded-full hover:bg-primary-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3">

            {/* Categories Accordion */}
            <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Grid3x3 className="w-3.5 h-3.5" />
              Shop by Category
            </p>

            <div className="space-y-1 mb-4">
              {MEGA_MENU_DATA.map((category) => (
                <div key={category.id} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-900 text-sm">{category.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-400 transition-transform duration-200",
                        expandedCategory === category.id && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Expanded Content */}
                  {expandedCategory === category.id && (
                    <div className="px-3 pb-3 animate-fade-in">
                      <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                        {/* Quick Types */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Popular Types</p>
                          <div className="flex flex-wrap gap-1.5">
                            {category.types.slice(0, 4).map((type) => (
                              <Link
                                key={type}
                                href={`${category.href}?type=${encodeURIComponent(type)}`}
                                onClick={onClose}
                                className="text-xs bg-white px-2.5 py-1 rounded-md text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-colors"
                              >
                                {type}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* View All Link */}
                        <Link
                          href={category.href}
                          onClick={onClose}
                          className="flex items-center justify-between text-xs font-semibold text-primary-700 hover:text-primary-800 pt-2 border-t border-gray-200"
                        >
                          Browse All {category.label}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main Links */}
            <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Quick Links
            </p>
            <div className="space-y-0.5 mb-4">
              {MAIN_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <MenuLink key={link.label} href={link.href} onClick={onClose} icon={<Icon className="w-5 h-5" />} badge={link.badge}>
                    {link.label}
                  </MenuLink>
                );
              })}
            </div>

            {/* Account Links */}
            {isHydrated && isAuthenticated && (
              <>
                <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  My Account
                </p>
                <div className="space-y-0.5 mb-4">
                  {ACCOUNT_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <MenuLink key={link.label} href={link.href} onClick={onClose} icon={<Icon className="w-5 h-5" />}>
                        {link.label}
                      </MenuLink>
                    );
                  })}
                </div>
              </>
            )}

            {/* Support */}
            <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Support
            </p>
            <div className="space-y-0.5">
              {SUPPORT_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <MenuLink key={link.label} href={link.href} onClick={onClose} icon={<Icon className="w-5 h-5" />}>
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
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Eco Footer */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-emerald-100" />
            <div>
              <p className="font-semibold text-sm">Sustainable Packaging</p>
              <p className="text-xs text-emerald-100">100% biodegradable materials</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MenuLink({ href, onClick, icon, badge, children }: {
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
      className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 font-medium text-sm hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 transition-colors"
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