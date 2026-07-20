"use client";

import { OrderStatus, PaymentStatus } from "@/types/api";
import { cn } from "@/lib/utils";

interface Props {
  status: OrderStatus | PaymentStatus;
  type?: "order" | "payment";
  size?: "sm" | "md";
}

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-amber-50 text-amber-700 border-amber-100",
  [OrderStatus.Confirmed]: "bg-blue-50 text-blue-700 border-blue-100",
  [OrderStatus.Processing]: "bg-indigo-50 text-indigo-700 border-indigo-100",
  [OrderStatus.Shipped]: "bg-purple-50 text-purple-700 border-purple-100",
  [OrderStatus.Delivered]: "bg-emerald-50 text-emerald-700 border-emerald-100",
  [OrderStatus.Cancelled]: "bg-red-50 text-red-700 border-red-100",
  [OrderStatus.Returned]: "bg-orange-50 text-orange-700 border-orange-100",
  [OrderStatus.Refunded]: "bg-stone-100 text-stone-700 border-stone-200",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "bg-amber-50 text-amber-700 border-amber-100",
  [PaymentStatus.Paid]: "bg-emerald-50 text-emerald-700 border-emerald-100",
  [PaymentStatus.Failed]: "bg-red-50 text-red-700 border-red-100",
  [PaymentStatus.Refunded]: "bg-stone-100 text-stone-700 border-stone-200",
  [PaymentStatus.PartiallyRefunded]: "bg-orange-50 text-orange-700 border-orange-100",
};

export function OrderStatusBadge({ status, type = "order", size = "sm" }: Props) {
  const styles =
    type === "order"
      ? ORDER_STATUS_STYLES[status as OrderStatus]
      : PAYMENT_STATUS_STYLES[status as PaymentStatus];

  const sizeStyles = size === "sm"
    ? "text-[10px] px-2 py-0.5"
    : "text-[11px] px-2.5 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border whitespace-nowrap",
        sizeStyles,
        styles
      )}
    >
      {status}
    </span>
  );
}