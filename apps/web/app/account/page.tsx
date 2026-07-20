// File: apps/web/app/account/page.tsx
// Premium, minimal account dashboard — no cringe, just clean design

"use client";

import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Lock,
  LogOut,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  User,
  CreditCard,
  Bell,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/hooks/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  {
    icon: Package,
    label: "My Orders",
    desc: "Track and manage orders",
    href: ROUTES.ORDERS,
  },
  {
    icon: Heart,
    label: "Wishlist",
    desc: "Saved items",
    href: ROUTES.WISHLIST,
  },
  {
    icon: MapPin,
    label: "Addresses",
    desc: "Delivery locations",
    href: ROUTES.ADDRESSES,
  },
  {
    icon: User,
    label: "Profile Details",
    desc: "Edit personal info",
    href: ROUTES.PROFILE,
  },
  {
    icon: CreditCard,
    label: "Payment Methods",
    desc: "Manage cards & UPI",
    href: "/account/payments",
  },
  {
    icon: Bell,
    label: "Notifications",
    desc: "Email & SMS preferences",
    href: "/account/notifications",
  },
  {
    icon: Lock,
    label: "Security",
    desc: "Password & 2FA",
    href: "/account/security",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    desc: "FAQs and contact",
    href: ROUTES.CONTACT,
  },
];

function AccountContent() {
  const { user, logout, isLoggingOut } = useAuth();

  if (!user) return null;

  return (
    <MainLayout>
      <div className="min-h-screen bg-stone-50/50 py-8 md:py-12">
        <div className="container-app max-w-3xl">
          
          {/* Profile Header — Clean & Minimal */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 md:p-8 mb-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary-50 border-2 border-white shadow-sm flex items-center justify-center text-3xl font-semibold text-primary-700">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                  {user.fullName}
                </h1>
                <p className="text-stone-500 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                    {user.role}
                  </span>
                  {user.isVerified && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <Link 
                href={ROUTES.PROFILE}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                aria-label="Edit profile"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stats — Minimal */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatBox label="Orders" value="12" />
            <StatBox label="Wishlist" value="8" />
            <StatBox label="Points" value="2.4k" />
          </div>

          {/* Menu Grid */}
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden divide-y divide-stone-50">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-4 md:p-5 hover:bg-stone-50/70 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900">{item.label}</p>
                    <p className="text-sm text-stone-500 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="mt-6 space-y-4">
            <Button
              onClick={() => logout()}
              disabled={isLoggingOut}
              variant="outline"
              className="w-full h-12 rounded-xl border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-stone-400">Vitakart v1.0.0</p>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 text-center">
      <p className="text-xl font-semibold text-stone-900">{value}</p>
      <p className="text-xs text-stone-500 mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}