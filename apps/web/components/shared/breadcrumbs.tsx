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
    <nav className="flex items-center gap-2 text-sm mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[#6B665D] hover:text-[#10B981] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[#10B981] font-semibold" : "text-[#6B665D]"}>
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="w-3 h-3 text-[#6B665D]" />
            )}
          </div>
        );
      })}
    </nav>
  );
}