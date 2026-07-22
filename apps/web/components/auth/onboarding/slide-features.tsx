// apps/web/components/auth/onboarding/slide-features.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface SlideFeaturesProps {
  onNext: () => void;
  onBack: () => void;
}

export function SlideFeatures({ onNext, onBack }: SlideFeaturesProps) {
  return (
    <div
      className="relative flex h-full w-full flex-col"
      style={{
        backgroundImage: "url('/images/onboarding/welcome-nutrition.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* SMOOTH FADE OVERLAY */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white via-white/90 via-40% to-transparent" />

      <div className="relative z-10 mt-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
            <Sparkles className="h-3 w-3" />
            Fresh & Authentic
          </span>

          <h1 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900">
            Nutrition Made
            <br />
            <span className="text-emerald-600">Simple & Fresh</span>
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Discover authentic wellness products, delivered fresh to your door.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 flex items-center gap-3"
        >
          <button
            onClick={onBack}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg transition-all active:scale-[0.95] hover:bg-slate-50"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>

          <button
            onClick={onNext}
            className="group flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-semibold text-white  transition-all active:scale-[0.97]"
          >
            Continue
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}