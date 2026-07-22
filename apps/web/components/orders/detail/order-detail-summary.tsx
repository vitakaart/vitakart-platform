// File: apps/web/components/orders/detail/order-detail-summary.tsx
// Price breakdown + payment method

"use client";

import { OrderStatusBadge } from "../order-status-badge";
import { PaymentMethod } from "@/types/api";
import type { Order } from "@/types/api";

interface Props {
  order: Order;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: "Cash on Delivery",
  [PaymentMethod.Razorpay]: "Online Payment",
  [PaymentMethod.UPI]: "UPI",
  [PaymentMethod.Card]: "Card",
  [PaymentMethod.NetBanking]: "Net Banking",
  [PaymentMethod.Wallet]: "Wallet",
};

export function OrderDetailSummary({ order }: Props) {
  return (
    <div className="bg-white border border-[#E9E1D2] rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm md:text-base font-semibold text-[#0A0A0A]">
          Payment Summary
        </h3>
        <OrderStatusBadge status={order.paymentStatus} type="payment" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6B665D]">Subtotal</span>
          <span className="font-semibold text-[#0A0A0A]">
            ₹{(order.subtotal + order.totalDiscount).toLocaleString("en-IN")}
          </span>
        </div>

        {order.totalDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#6B665D]">Discount</span>
            <span className="font-semibold text-[#10B981]">
              -₹{order.totalDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {order.couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#6B665D]">
              Coupon {order.couponCode && `(${order.couponCode})`}
            </span>
            <span className="font-semibold text-[#10B981]">
              -₹{order.couponDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[#6B665D]">Shipping</span>
          {order.shippingFee === 0 ? (
            <span className="font-semibold text-[#10B981]">FREE</span>
          ) : (
            <span className="font-semibold text-[#0A0A0A]">
              ₹{order.shippingFee.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {order.taxAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#6B665D]">Tax</span>
            <span className="font-semibold text-[#0A0A0A]">
              ₹{order.taxAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-stone-100">
          <span className="font-bold text-[#0A0A0A]">Total Paid</span>
          <span className="text-lg font-bold text-[#0A0A0A]">
            ₹{order.total.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between pt-2 mt-1 border-t border-stone-100">
          <span className="text-xs text-[#6B665D]">Payment Method</span>
          <span className="text-xs font-semibold text-[#0A0A0A]">
            {PAYMENT_METHOD_LABELS[order.paymentMethod]}
          </span>
        </div>
      </div>
    </div>
  );
}