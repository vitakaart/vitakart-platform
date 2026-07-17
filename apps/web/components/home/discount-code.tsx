// File: apps/web/components/home/discount-code.tsx
"use client";

import { toast } from "sonner";

export function DiscountCode() {
  const handleCopy = () => {
    navigator.clipboard.writeText("VITA256AC");
    toast.success("Discount code copied!");
  };

  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-red-600">First purchase offer</div>
          <div className="mt-1 text-lg font-bold text-[#0A0A0A]">
            Use code VITA256AC for an instant welcome discount
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#FFFDF8] px-4 py-3 text-sm font-black tracking-[0.2em] text-red-600">
            VITA256AC
          </div>
          <button
            onClick={handleCopy}
            className="min-h-11 rounded-2xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition-all duration-300 hover:scale-105"
          >
            Copy
          </button>
        </div>
      </div>
    </section>
  );
}