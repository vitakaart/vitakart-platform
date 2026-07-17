// File: apps/web/components/product-detail/feature-badges.tsx
// 4 feature badges row (Vegan, Lab Tested, etc.)

import { Leaf, ShieldCheck, XCircle, Wheat } from "lucide-react";

const FEATURES = [
  {
    icon: Leaf,
    title: "100% Vegan",
    description: "Plant-based source for ethical wellness.",
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
  },
  {
    icon: ShieldCheck,
    title: "Lab Tested",
    description: "3rd party verified for purity and potency.",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: XCircle,
    title: "Non-GMO",
    description: "No genetically modified organisms used.",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    icon: Wheat,
    title: "Gluten Free",
    description: "Safe for individuals with gluten sensitivity.",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

export function FeatureBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className="rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] p-4 text-center"
          >
            <div
              className={`w-10 h-10 mx-auto rounded-full ${feature.bg} flex items-center justify-center mb-2`}
            >
              <Icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <div className="text-sm font-bold text-[#0A0A0A] mb-1">
              {feature.title}
            </div>
            <p className="text-[10px] text-[#6B665D] leading-4">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}