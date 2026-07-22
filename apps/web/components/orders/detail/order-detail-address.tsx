// File: apps/web/components/orders/detail/order-detail-address.tsx
// Shipping address snapshot

"use client";

import { MapPin, Phone } from "lucide-react";
import type { Order } from "@/types/api";

interface Props {
  order: Order;
}

export function OrderDetailAddress({ order }: Props) {
  return (
    <div className="bg-white border border-[#E9E1D2] rounded-2xl p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-[#10B981]" />
        <h3 className="text-sm md:text-base font-semibold text-[#0A0A0A]">
          Delivery Address
        </h3>
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-semibold text-[#0A0A0A]">{order.shippingFullName}</p>
        <p className="text-[#6B665D]">{order.shippingAddressLine1}</p>
        {order.shippingAddressLine2 && (
          <p className="text-[#6B665D]">{order.shippingAddressLine2}</p>
        )}
        {order.shippingLandmark && (
          <p className="text-[#6B665D]">Near {order.shippingLandmark}</p>
        )}
        <p className="text-[#6B665D]">
          {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
        </p>
        <p className="text-[#6B665D]">{order.shippingCountry}</p>

        <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-stone-100">
          <Phone className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-[#0A0A0A] font-medium">
            {order.shippingPhone}
          </span>
        </div>
      </div>

      {order.customerNotes && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500 mb-1">
            Delivery Instructions
          </p>
          <p className="text-sm text-[#6B665D] italic">{order.customerNotes}</p>
        </div>
      )}
    </div>
  );
}