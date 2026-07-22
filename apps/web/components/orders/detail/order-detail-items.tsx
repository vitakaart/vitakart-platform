// File: apps/web/components/orders/detail/order-detail-items.tsx
// Products list in this order

"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { Order } from "@/types/api";

interface Props {
  order: Order;
}

export function OrderDetailItems({ order }: Props) {
  return (
    <div className="bg-white border border-[#E9E1D2] rounded-2xl p-4 md:p-5">
      <h3 className="text-sm md:text-base font-semibold text-[#0A0A0A] mb-4">
        Items ({order.items.length})
      </h3>

      <div className="space-y-3">
        {order.items.map((item) => (
          <Link
            key={item.id}
            href={ROUTES.PRODUCT_DETAIL(item.productSlug)}
            className="flex gap-3 p-2 -mx-2 rounded-xl hover:bg-[#F5F1E8] transition-colors group"
          >
            {/* Image */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white border border-[#E9E1D2] overflow-hidden shrink-0 relative">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F5F1E8]">
                  <Package className="w-6 h-6 text-stone-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              {item.productBrand && (
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                  {item.productBrand}
                </p>
              )}
              <h4 className="text-sm font-semibold text-[#0A0A0A] line-clamp-2 group-hover:text-[#10B981] transition-colors">
                {item.productName}
              </h4>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-stone-500">
                  Qty: <span className="font-semibold text-[#0A0A0A]">{item.quantity}</span>
                </span>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0A0A0A]">
                    ₹{item.totalPrice.toLocaleString("en-IN")}
                  </p>
                  {item.savedAmount > 0 && (
                    <p className="text-[10px] text-[#10B981] font-semibold">
                      Saved ₹{item.savedAmount.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}