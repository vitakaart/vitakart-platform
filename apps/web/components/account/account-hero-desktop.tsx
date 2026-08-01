// apps/web/components/account/account-hero-desktop.tsx
"use client";

import Link from "next/link";
import Image from "next/image"
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
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 ">
      {/* Background Image */}
      <Image
        src="https://imgs.search.brave.com/SqzG_jkaPTWGQfsRtA66AIDPtWUNElIqFEFfu4rrC0k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/cG5nLXZlY3Rvci8y/MDI0MDcyNC9vdXJt/aWQvcG5ndHJlZS1i/YWNrZ3JvdW5kLWFi/c3RyYWN0LWJhbm5l/ci1wbmctaW1hZ2Vf/MTI4MDUwMTIucG5n"
        alt="Healthy Lifestyle"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-emerald-700/50 to-black/50" />

      {/* Premium Glow */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_55%)]" /> */}

      {/* Blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200">
              Welcome Back
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight drop-shadow-lg">
              Hi, {userName.split(" ")[0]} 👋
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-7 text-emerald-50/90">
              Track your orders, manage your account, save your favourite products,
              and continue your healthy lifestyle journey with Vitakart.
            </p>
          </div>

          <div className="hidden md:block">
            <Link
              href={ROUTES.PROFILE}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300  hover:bg-black !hover:text-black hover:shadow-xl active:scale-95"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {isVerified && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-white/10 px-4 py-2 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span className="text-sm font-semibold text-white">
              Verified Account
            </span>
          </div>
        )}
      </div>
    </div>
  );
}