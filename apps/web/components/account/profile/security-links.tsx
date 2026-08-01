// File: apps/web/app/account/profile/components/security-links.tsx
// Security-related quick links

"use client";

import Link from "next/link";
import { ChevronRight, Lock, ShieldCheck } from "lucide-react";

interface SecurityLink {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: "emerald" | "blue" | "orange";
}

const SECURITY_LINKS: SecurityLink[] = [
  {
    href: "/account/change-password",
    icon: Lock,
    title: "Change Password",
    description: "Update your account password securely",
    color: "emerald",
  },
  {
    href: "/account/security",
    icon: ShieldCheck,
    title: "Security Settings",
    description: "Two-factor auth, login history & more",
    color: "blue",
  },
];

const COLOR_MAP = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
};

export function SecurityLinks() {
  return (
    <div>
      <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        Security & Access
      </p>

      <div className="space-y-2.5">
        {SECURITY_LINKS.map((link) => (
          <SecurityLinkCard key={link.href} link={link} />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// SINGLE LINK CARD
// ==========================================

function SecurityLinkCard({ link }: { link: SecurityLink }) {
  const Icon = link.icon;
  const colorClass = COLOR_MAP[link.color];

  return (
    <Link
      href={link.href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{link.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{link.description}</p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-700" />
    </Link>
  );
}