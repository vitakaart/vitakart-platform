// File: apps/web/components/orders/detail/order-detail-content.tsx
// Main content — works in both mobile bottom sheet & desktop page

"use client";

import { OrderDetailHeader } from "./order-detail-header";
import { OrderDetailStatus } from "./order-detail-status";
import { OrderDetailItems } from "./order-detail-items";
import { OrderDetailAddress } from "./order-detail-address";
import { OrderDetailSummary } from "./order-detail-summary";
import { OrderDetailActions } from "./order-detail-actions";
import type { Order } from "@/types/api";

interface Props {
  order: Order;
  isMobile?: boolean;
  onClose?: () => void;
  onCancel: (reason?: string) => void;
  isCancelling: boolean;
}

export function OrderDetailContent({
  order,
  isMobile,
  onClose,
  onCancel,
  isCancelling,
}: Props) {
  return (
    <>
      <OrderDetailHeader
        order={order}
        isMobile={isMobile}
        onClose={onClose}
      />

      <div className="p-4 md:p-0 space-y-3 md:space-y-4">
        <OrderDetailStatus order={order} />
        <OrderDetailItems order={order} />
        <OrderDetailAddress order={order} />
        <OrderDetailSummary order={order} />
        <OrderDetailActions
          order={order}
          onCancel={onCancel}
          isCancelling={isCancelling}
        />
      </div>
    </>
  );
}