// apps/web/components/account/account-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface AccountSidebarProps {
  menuItems: MenuItem[];
}

export function AccountSidebar({ menuItems }: AccountSidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  if (!user) return null;

  return (
    <aside
      className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col gap-4  pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent"
    >
      {/* Profile card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-900">
            {user.fullName}
          </h2>
          <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              {user.role}
            </span>
            {user.isVerified && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="rounded-3xl border border-slate-100 bg-white p-2 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => logout()}
        disabled={isLoggingOut}
        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Signing out..." : "Sign Out"}
      </button>

      <p className="pb-2 text-center text-[11px] text-slate-400">
        Vitakart v1.0.0
      </p>
    </aside>
  );
}