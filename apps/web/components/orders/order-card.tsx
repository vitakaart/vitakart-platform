"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { OrderStatusBadge } from "./order-status-badge";
import { ROUTES } from "@/lib/constants/routes";
import type { OrderListItem } from "@/types/api";

interface Props {
  order: OrderListItem;
}

export function OrderCard({ order }: Props) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={ROUTES.ORDER_DETAIL(order.id)}
      className="group flex items-center gap-3 bg-white rounded-xl border border-stone-100 px-4 py-3 hover:border-stone-200 hover:shadow-sm active:scale-[0.99] transition-all"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-[#10B981]/10 transition-colors">
        <Package className="w-4 h-4 text-stone-600 group-hover:text-[#10B981] transition-colors" />
      </div>

      {/* Middle — Order info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-stone-900 truncate">
            {order.orderNumber}
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-[11px] text-stone-500">
          {orderDate} • {order.totalItems} item{order.totalItems !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Right — Price + Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-stone-900 leading-tight">
            ₹{order.total.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            {order.paymentStatus}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}