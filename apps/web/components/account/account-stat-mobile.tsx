// apps/web/components/account/account-stat-mobile.tsx
"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatColor = "blue" | "rose" | "amber";

interface AccountStatMobileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  color: StatColor;
  comingSoon?: boolean;
  loading?: boolean;
}

const COLOR_MAP: Record<StatColor, string> = {
  blue: "bg-blue-50 text-blue-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
};

export function AccountStatMobile({
  icon: Icon,
  label,
  value,
  href,
  color,
  comingSoon,
  loading,
}: AccountStatMobileProps) {
  const content = (
    <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all active:scale-[0.98]">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${COLOR_MAP[color]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <p className="text-xl font-bold text-slate-900">
        {loading ? (
          <span className="inline-block h-5 w-6 animate-pulse rounded bg-slate-200" />
        ) : (
          value
        )}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      {comingSoon && (
        <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white shadow-md">
          Soon
        </span>
      )}
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