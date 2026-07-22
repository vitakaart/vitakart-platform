// apps/web/components/account/account-menu-card.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AccountMenuCardProps {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
  iconBg?: string;
  iconColor?: string;
}

export function AccountMenuCard({
  icon: Icon,
  label,
  desc,
  href,
  iconBg = "bg-emerald-50",
  iconColor = "text-emerald-600",
}: AccountMenuCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          iconBg,
          iconColor
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-700" />
    </Link>
  );
}