// apps/web/components/account/account-stat-card.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AccountStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  comingSoon?: boolean;
  gradient?: string;
  iconBg?: string;
  loading?: boolean;
}

export function AccountStatCard({
  icon: Icon,
  label,
  value,
  href,
  comingSoon,
  gradient = "from-emerald-500 to-emerald-600",
  iconBg = "bg-emerald-50 text-emerald-600",
  loading,
}: AccountStatCardProps) {
  const content = (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all",
        !comingSoon && href && "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
      )}
    >
      {/* Corner accent */}
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          gradient
        )}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            iconBg
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>

        {href && !comingSoon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        )}

        {comingSoon && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-600">
            Soon
          </span>
        )}
      </div>

      <div className="relative mt-6">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {loading ? (
            <span className="inline-block h-8 w-10 animate-pulse rounded-lg bg-slate-200" />
          ) : comingSoon ? (
            "—"
          ) : (
            value
          )}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );

  if (href && !comingSoon) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}