// File: apps/web/components/orders/detail/order-detail-header.tsx
// Order # + Date + Back button

"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { OrderStatusBadge } from "../order-status-badge";
import { ROUTES } from "@/lib/constants/routes";
import type { Order } from "@/types/api";

interface Props {
  order: Order;
  isMobile?: boolean;
  onClose?: () => void;
}

export function OrderDetailHeader({ order, isMobile, onClose }: Props) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="flex items-start gap-3 px-4 md:px-0 py-3 md:py-0 border-b border-[#E9E1D2] md:border-0 md:mb-6 bg-[#FEFBF3] md:bg-transparent sticky top-0 md:static z-10">
      {/* Mobile Close | Desktop Back */}
      {isMobile ? (
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#E9E1D2] text-[#6B665D] hover:bg-[#F5F1E8] active:scale-95 transition-all shrink-0"
          aria-label="Close"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      ) : (
        <Link
          href={ROUTES.ORDERS}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#E9E1D2] text-[#6B665D] hover:bg-[#F5F1E8] active:scale-95 transition-all shrink-0"
          aria-label="Back to orders"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-stone-400">
            Order
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
        <h1 className="text-base md:text-2xl font-bold text-[#0A0A0A] truncate">
          {order.orderNumber}
        </h1>
        <p className="text-[11px] md:text-sm text-[#6B665D] mt-0.5 flex items-center gap-1">
          <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
          {orderDate}
        </p>
      </div>
    </div>
  );
}