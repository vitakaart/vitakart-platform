// File: apps/web/components/layout/navbar/categories-bar.tsx
// Desktop categories navigation bar

import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const CATEGORIES = [
  { label: "Home", href: ROUTES.HOME },
  { label: "All Products", href: ROUTES.PRODUCTS },
  { label: "Categories", href: ROUTES.CATEGORIES },
  { label: "🔥 Deals", href: "#" },
  { label: "New Arrivals", href: "#" },
  { label: "Best Sellers", href: "#" },
];

export function CategoriesBar() {
  return (
    <nav className="hidden md:flex items-center gap-6 h-12 border-t border-gray-100">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
}