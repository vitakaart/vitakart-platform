// apps/web/components/account/account-layout.tsx
"use client";

import type { ReactNode } from "react";
import {
  Bell,
  Heart,
  HelpCircle,
  Lock,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { ROUTES } from "@/lib/constants/routes";

interface AccountLayoutProps {
  children: ReactNode;
}

const SIDEBAR_MENU = [
  { icon: Package, label: "My Orders", href: ROUTES.ORDERS },
  { icon: Heart, label: "Wishlist", href: ROUTES.WISHLIST },
  { icon: MapPin, label: "Addresses", href: ROUTES.ADDRESSES },
  { icon: User, label: "Profile", href: ROUTES.PROFILE },
  { icon: Bell, label: "Notifications", href: "/account/notifications" },
  { icon: Lock, label: "Security", href: "/account/security" },
  { icon: HelpCircle, label: "Help", href: ROUTES.CONTACT },
];

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-6 md:py-10">
          <div className="container-app max-w-7xl">
            {/* ═══════════════════════════════════
                DESKTOP — Sidebar + Content
            ═══════════════════════════════════ */}
            <div className="hidden gap-8 lg:grid lg:grid-cols-[320px_1fr]">
              <AccountSidebar menuItems={SIDEBAR_MENU} />

              <main className="min-w-0">{children}</main>
            </div>

            {/* ═══════════════════════════════════
                MOBILE — Full width
            ═══════════════════════════════════ */}
            <div className="lg:hidden">{children}</div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}