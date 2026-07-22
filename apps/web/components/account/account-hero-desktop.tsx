// apps/web/components/account/account-hero-desktop.tsx
"use client";

import Link from "next/link";
import { Settings, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface AccountHeroDesktopProps {
  userName: string;
  isVerified: boolean;
}

export function AccountHeroDesktop({
  userName,
  isVerified,
}: AccountHeroDesktopProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-8 text-white shadow-[0_10px_40px_rgba(16,185,129,0.25)]">
      {/* Blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-lime-300/15 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Hi, {userName.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-emerald-50">
            Track your orders, manage preferences, and continue your wellness
            journey with Vitakart.
          </p>
        </div>

        <div className="hidden shrink-0 md:block">
          <Link
            href={ROUTES.PROFILE}
            className="flex items-center gap-2 rounded-full border border-white bg-white/80 px-5 py-2.5 text-sm font-semibold !text-black shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {isVerified && (
        <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">Verified Account</span>
        </div>
      )}
    </div>
  );
}