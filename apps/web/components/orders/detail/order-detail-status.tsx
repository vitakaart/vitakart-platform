// File: apps/web/components/orders/detail/order-detail-status.tsx
// Vertical status timeline

"use client";

import { CheckCircle2, Package, Truck, Home, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/api";
import type { Order } from "@/types/api";
import { cn } from "@/lib/utils";

interface Props {
  order: Order;
}

const STEPS = [
  { key: "placed", label: "Order Placed", icon: CheckCircle2 },
  { key: "confirmed", label: "Confirmed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

function getCompletedSteps(status: OrderStatus): number {
  switch (status) {
    case OrderStatus.Pending:
      return 1;
    case OrderStatus.Confirmed:
    case OrderStatus.Processing:
      return 2;
    case OrderStatus.Shipped:
      return 3;
    case OrderStatus.Delivered:
      return 4;
    default:
      return 0;
  }
}

export function OrderDetailStatus({ order }: Props) {
  const isCancelled = order.status === OrderStatus.Cancelled;
  const completedSteps = getCompletedSteps(order.status);

  // Show cancelled state
  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-red-900">
              Order Cancelled
            </h3>
            {order.cancelledAt && (
              <p className="text-xs md:text-sm text-red-700 mt-0.5">
                {new Date(order.cancelledAt).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E9E1D2] rounded-2xl p-4 md:p-5">
      <h3 className="text-sm md:text-base font-semibold text-[#0A0A0A] mb-4">
        Order Status
      </h3>

      <div className="relative flex lg:flex-col">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-stone-100" />

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < completedSteps;
            const isCurrent = index === completedSteps - 1;

            return (
              <div key={step.key} className="flex items-start gap-3 relative">
                {/* Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-1 transition-colors",
                    isCompleted
                      ? "bg-[#10B981] text-white"
                      : "bg-stone-100 text-stone-400"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Label */}
                <div className="flex-1 pt-1">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isCompleted ? "text-[#0A0A0A]" : "text-stone-400"
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[11px] text-[#10B981] font-medium mt-0.5">
                      Current status
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}