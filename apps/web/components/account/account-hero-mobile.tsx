// apps/web/components/account/account-hero-mobile.tsx
"use client";

import Link from "next/link";
import { Settings, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface AccountHeroMobileProps {
  userName: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export function AccountHeroMobile({
  userName,
  email,
  role,
  isVerified,
}: AccountHeroMobileProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-6 text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-lime-300/15 blur-3xl" />

      <div className="relative flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-emerald-600 shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-emerald-900 ring-2 ring-emerald-600">
              <ShieldCheck className="h-3 w-3" strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-emerald-100">Welcome back</p>
          <h1 className="mt-0.5 truncate text-lg font-bold">{userName}</h1>
          <p className="truncate text-xs text-emerald-100">{email}</p>
        </div>

        <Link
          href={ROUTES.PROFILE}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25"
          aria-label="Edit profile"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md">
          {role}
        </span>
        {isVerified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
            <ShieldCheck className="h-2.5 w-2.5" strokeWidth={3} />
            Verified
          </span>
        )}
      </div>
    </div>
  );
}