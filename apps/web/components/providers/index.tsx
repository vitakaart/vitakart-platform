// File: apps/web/components/providers/index.tsx

"use client";

import { QueryProvider } from "./query-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <CartDrawer />
    </QueryProvider>
  );
}