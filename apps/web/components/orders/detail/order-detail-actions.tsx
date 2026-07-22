// File: apps/web/components/orders/detail/order-detail-actions.tsx
// Cancel / Track / Reorder buttons

"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { OrderStatus } from "@/types/api";
import type { Order } from "@/types/api";

interface Props {
  order: Order;
  onCancel: (reason?: string) => void;
  isCancelling: boolean;
}

const CAN_CANCEL_STATUSES = [OrderStatus.Pending, OrderStatus.Confirmed];

export function OrderDetailActions({ order, onCancel, isCancelling }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");

  const canCancel = CAN_CANCEL_STATUSES.includes(order.status);

  if (!canCancel) return null;

  const handleCancel = () => {
    onCancel(reason || undefined);
    setShowConfirm(false);
    setReason("");
  };

  return (
    <>
      <div className="bg-white border border-[#E9E1D2] rounded-2xl p-4 md:p-5">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isCancelling}
          className="w-full h-11 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCancelling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              Cancel Order
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full animate-scale-in">
            <h3 className="text-base font-bold text-[#0A0A0A] mb-2">
              Cancel this order?
            </h3>
            <p className="text-sm text-[#6B665D] mb-4">
              This action cannot be undone. Stock will be restored.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason for cancellation (optional)"
              maxLength={500}
              className="w-full p-3 rounded-lg border border-[#E9E1D2] text-sm resize-none focus:outline-none focus:border-[#10B981]"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-10 rounded-lg border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-all"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}