"use client";

import { CheckCircle2 } from "lucide-react";

interface Props {
  count: number;
}

export function OrdersEndMessage({ count }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-14 h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#0A0A0A]">
          You&apos;re all caught up!
        </p>
        <p className="text-xs text-[#6B665D] mt-1">
          Showing all {count} order{count !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}