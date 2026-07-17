// File: apps/web/components/home/footer-categories.tsx
import { Pill, Dumbbell, Leaf, Heart, Shield, Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "Vitamins", items: "124 items", icon: Pill, bg: "bg-[#10B981]/15", color: "text-[#10B981]" },
  { name: "Sports", items: "86 items", icon: Dumbbell, bg: "bg-[#F59E0B]/15", color: "text-[#F59E0B]" },
  { name: "Ayurveda", items: "64 items", icon: Leaf, bg: "bg-[#10B981]/15", color: "text-[#10B981]" },
  { name: "Beauty", items: "42 items", icon: Heart, bg: "bg-[#F59E0B]/15", color: "text-[#F59E0B]" },
  { name: "Immunity", items: "55 items", icon: Shield, bg: "bg-[#10B981]/15", color: "text-[#10B981]" },
  { name: "Wellness", items: "73 items", icon: Sparkles, bg: "bg-[#F59E0B]/15", color: "text-[#F59E0B]" },
];

export function FooterCategories() {
  return (
    <section className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.name} className="rounded-3xl border border-[#E9E1D2] bg-[#FEFBF3] p-4 text-center shadow-sm">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bg} ${cat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="mt-3 text-sm font-bold text-[#0A0A0A]">{cat.name}</div>
            <div className="text-xs text-[#6B665D]">{cat.items}</div>
          </div>
        );
      })}
    </section>
  );
}