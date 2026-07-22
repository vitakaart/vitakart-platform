// apps/web/components/account/account-section-header.tsx
"use client";

interface AccountSectionHeaderProps {
  title: string;
  subtitle: string;
}

export function AccountSectionHeader({
  title,
  subtitle,
}: AccountSectionHeaderProps) {
  return (
    <div className="flex items-end justify-between px-1">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}