// File: apps/web/components/product-detail/product-tabs.tsx
// Description/Ingredients/How to Use tabs

"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

interface ProductTabsProps {
  product: Product;
}

const TABS = ["Description", "Ingredients", "How to Use", "Clinical Studies"];

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-[#E9E1D2] flex overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 md:px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors relative",
              activeTab === tab
                ? "text-[#10B981]"
                : "text-[#6B665D] hover:text-[#0A0A0A]"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-6">
        {activeTab === "Description" && (
          <div className="grid md:grid-cols-[1fr_280px] gap-6">
            {/* Description Content */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                The Science of Natural Immunity
              </h3>
              <p className="text-sm text-[#6B665D] leading-6 mb-4">
                {product.description ||
                  "Our Organic Vitamin C + Zinc supplement is a high-potency formula designed to support your body's natural defenses. Derived from organic Amla and Acerola cherries, our Vitamin C is highly bioavailable, ensuring maximum absorption compared to synthetic alternatives."}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                {[
                  "Boosts white blood cell production for faster immune response.",
                  "Powerful antioxidants fight oxidative stress and cellular aging.",
                  "Zinc supports structural integrity of cell membranes.",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#0A0A0A]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutritional Table */}
            <div className="rounded-2xl bg-[#F5F1E8] border border-[#E9E1D2] p-4">
              <h4 className="text-sm font-bold text-[#0A0A0A] mb-3">
                Nutritional Value
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Vitamin C", value: "500mg (85% RDA)" },
                  { label: "Zinc (as Gluconate)", value: "10mg (100% RDA)" },
                  { label: "Organic Amla Ext.", value: "250mg" },
                  { label: "Citrus Bioflavonoids", value: "50mg" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between gap-2 py-1 border-b border-[#E9E1D2] last:border-0">
                    <span className="text-[#6B665D]">{item.label}</span>
                    <span className="font-bold text-[#0A0A0A] text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Ingredients" && (
          <div className="text-sm text-[#6B665D] leading-6">
            <p className="mb-4">
              <strong className="text-[#0A0A0A]">Active Ingredients:</strong>
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Vitamin C (Ascorbic Acid) - 500mg</li>
              <li>Zinc Gluconate - 10mg</li>
              <li>Organic Amla Extract - 250mg</li>
              <li>Citrus Bioflavonoids - 50mg</li>
              <li>Rose Hip Extract - 25mg</li>
            </ul>
          </div>
        )}

        {activeTab === "How to Use" && (
          <div className="space-y-3 text-sm text-[#6B665D] leading-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold flex-shrink-0">1</div>
              <p>Take 1 tablet daily with a glass of water, preferably after breakfast.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold flex-shrink-0">2</div>
              <p>For enhanced absorption, take with vitamin C-rich foods.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold flex-shrink-0">3</div>
              <p>Consult your healthcare provider before use if pregnant or nursing.</p>
            </div>
          </div>
        )}

        {activeTab === "Clinical Studies" && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-[#0A0A0A]">
              📚 Clinical studies and research data will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}