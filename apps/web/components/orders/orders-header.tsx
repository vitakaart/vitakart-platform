// File: apps/web/components/orders/orders-header.tsx
// Compact mobile header — back + title inline

"use client";

import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ROUTES } from "@/lib/constants/routes";

interface Props {
  totalCount: number;
}

export function OrdersHeader({ totalCount }: Props) {
  return (
    <>
      {/* ==========================================
           MOBILE: Back + Title inline (compact)
           ========================================== */}
      <div className="flex items-center gap-3 mb-4 md:hidden">
        <Link
          href={ROUTES.ACCOUNT}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#E9E1D2] text-[#6B665D] hover:bg-[#F5F1E8] active:scale-95 transition-all shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-[#0A0A0A] tracking-tight leading-tight">
            My Orders
          </h1>
          <p className="text-[11px] text-[#6B665D] mt-0.5">
            {totalCount} total order{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ==========================================
           DESKTOP: Breadcrumbs + Big header
           ========================================== */}
      <div className="hidden md:block">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Account", href: ROUTES.ACCOUNT },
              { label: "Orders" },
            ]}
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-[#6B665D] mt-0.5">
              {totalCount} total order{totalCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}