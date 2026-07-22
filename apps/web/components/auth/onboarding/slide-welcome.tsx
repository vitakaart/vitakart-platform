// apps/web/components/auth/onboarding/slide-welcome.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface SlideWelcomeProps {
  onNext: () => void;
}

export function SlideWelcome({ onNext }: SlideWelcomeProps) {
  return (
    <div
      className="relative flex h-full w-full flex-col"
      style={{
        backgroundImage: "url('/images/onboarding/welcome-fitness.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ═══════════════════════════════════
          SMOOTH FADE OVERLAY — bottom
      ═══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white via-white/90 via-40% to-transparent" />

      {/* Content */}
      <div className="relative z-10 mt-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
            <Sparkles className="h-3 w-3" />
            Premium Wellness
          </span>

          <h1 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900">
            Live Your
            <br />
            <span className="text-emerald-600">Healthiest Life</span>
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Track your fitness journey with premium wellness products.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={onNext}
          className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-base font-semibold text-white transition-all active:scale-[0.97]"
        >
          Get Started
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </div>
  );
}