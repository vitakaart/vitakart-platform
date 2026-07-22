// apps/web/components/account/account-signout-button.tsx
"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

export function AccountSignoutButton() {
  const { logout, isLoggingOut } = useAuth();

  return (
    <div className="space-y-3 pb-6">
      <button
        onClick={() => logout()}
        disabled={isLoggingOut}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Signing out..." : "Sign Out"}
      </button>

      <p className="text-center text-[11px] text-slate-400">Vitakart v1.0.0</p>
    </div>
  );
}