// File: apps/web/components/shared/breadcrumbs.tsx
// Reusable breadcrumbs with green accent

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 mb-4 text-sm uppercase">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[#6B665D] transition-colors hover:text-[#10B981]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-[#10B981]"
                    : "text-[#6B665D]"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-3 w-3 text-[#6B665D]" />
            )}
          </div>
        );
      })}
    </nav>
  );
}