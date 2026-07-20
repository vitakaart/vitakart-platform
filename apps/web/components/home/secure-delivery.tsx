// File: apps/web/components/home/secure-delivery.tsx
import { Truck } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export function SecureDelivery() {
  return (
    <section className="rounded-3xl bg-[#10B981] px-5 py-4  shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center text-white rounded-2xl bg-white/15 flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">100% Secure delivery</div>
            <div className="text-sm text-white/80">Cold-chain aware packaging, tamper-safe boxes, and live support.</div>
          </div>
        </div>
        <Link
          href={ROUTES.PRODUCTS}
          className="min-h-11 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-all duration-300 hover:scale-105 text-center"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}