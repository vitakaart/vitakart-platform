// File: apps/web/app/account/page.tsx
// User account dashboard — protected route

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";

const MENU_ITEMS = [
  {
    icon: Package,
    label: "My Orders",
    description: "Track and manage your orders",
    href: ROUTES.ORDERS,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Heart,
    label: "Wishlist",
    description: "Your saved products",
    href: ROUTES.WISHLIST,
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: MapPin,
    label: "Addresses",
    description: "Manage delivery addresses",
    href: ROUTES.ADDRESSES,
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: User,
    label: "My Profile",
    description: "Update personal information",
    href: ROUTES.PROFILE,
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Lock,
    label: "Change Password",
    description: "Update your account password",
    href: "/account/change-password",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Notifications and preferences",
    href: ROUTES.SETTINGS,
    color: "bg-gray-50 text-gray-600",
  },
];

function AccountContent() {
  const { user, logout, isLoggingOut } = useAuth();
  const authStore = useAuthStore();

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-10 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 md:p-8 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl shadow-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold truncate">
                {user.fullName}
              </h1>
              <p className="text-sm text-primary-100 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold text-primary-700 bg-white px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
                {user.isVerified && (
                  <span className="text-[10px] font-semibold text-success-700 bg-success-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          <StatCard label="Orders" value="0" color="text-blue-600" />
          <StatCard label="Wishlist" value="0" color="text-pink-600" />
          <StatCard label="Reviews" value="0" color="text-purple-600" />
        </div>

        {/* Menu Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === MENU_ITEMS.length - 1;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors
                  ${!isLast && "border-b border-gray-100"}
                `}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={() => logout()}
          disabled={isLoggingOut}
          variant="outline"
          className="w-full h-12 border-danger-200 text-danger-600 hover:bg-danger-50 hover:text-danger-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Vitakart v1.0.0</p>
          <p className="text-[10px] text-gray-400 mt-1">
            Made with ❤️ for your wellness
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
      <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
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