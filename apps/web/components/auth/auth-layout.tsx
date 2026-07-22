// apps/web/components/auth/auth-layout.tsx
"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {  Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { AuthModeSwitch } from "@/components/auth/auth-mode-switch";
import { AuthStepIndicator } from "@/components/auth/auth-step-indicator";
import { OnboardingFlow } from "@/components/auth/onboarding/onboarding-flow";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  mode: "login" | "register";
  currentStep?: number;
  totalSteps?: number;
}

const HERO_SLIDES = [
  {
    image: "/images/onboarding/welcome-fitness.png",
    heading: "Live Your",
    accent: "Healthiest Life",
    description:
      "Track your fitness journey with premium wellness products.",
  },
  {
    image: "/images/onboarding/welcome-nutrition.png",
    heading: "Nutrition Made",
    accent: "Simple & Fresh",
    description:
      "Discover authentic wellness products, curated for your goals.",
  },
];

export function AuthLayout({
  children,
  title,
  subtitle,
  mode,
  currentStep,
  totalSteps = 2,
}: AuthLayoutProps) {
  const step = currentStep ?? (mode === "login" ? 1 : 2);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = HERO_SLIDES[heroIndex];

  const mobileFormContent = (
    <>
      <AuthModeSwitch mode={mode} />

      <div className="mb-5 mt-5">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════
          MOBILE (< lg)
      ═══════════════════════════════════════════ */}
      <div className="lg:hidden">
        <OnboardingFlow mode={mode}>{mobileFormContent}</OnboardingFlow>
      </div>

      {/* ═══════════════════════════════════════════
          DESKTOP (≥ lg) — Fixed height, no scroll
      ═══════════════════════════════════════════ */}
      <div className="hidden h-screen lg:flex">
        {/* ══════════════════════════
            LEFT — Full BG image
        ══════════════════════════ */}
        <aside className="relative h-screen w-[52%] overflow-hidden xl:w-[55%]">
          {/* Background image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${currentHero.image})` }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-emerald-900/10" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/95 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />

          {/* Content overlay */}
          <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
            {/* Top — Logo */}
            <Link href={ROUTES.HOME} className="flex w-fit items-center gap-2.5">
              <Image src="/logos/vitakart-transparent.png" alt="" width={100} height={100} />

            </Link>
        

        {/* Bottom — Compact text overlay */}
        <div className="max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${heroIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                <Sparkles className="h-3 w-3" />
                Premium Wellness
              </span>

              <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 xl:text-[2.75rem]">
                {currentHero.heading}
                <br />
                <span className="text-emerald-600">
                  {currentHero.accent}
                </span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-700 xl:text-base">
                {currentHero.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="mt-5 flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === heroIndex
                    ? "w-7 bg-emerald-500"
                    : "w-1.5 bg-slate-400/60 hover:bg-slate-500"
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </aside >

    {/* ══════════════════════════
            RIGHT — Form (scrollable if needed)
        ══════════════════════════ */}
      < main className = "relative flex h-screen flex-1 items-center justify-center overflow-hidden bg-white px-6 py-6 xl:px-10" >
        {/* Subtle grid */ }
        < div className = "absolute inset-0 [background-image:linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative z-10 flex h-full w-full max-w-[26rem] items-center">
            <div className="max-h-full w-full">
              {/* Form card — scrollable inside */}
              <div className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] xl:p-8 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                {/* Top: eyebrow + step */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      {mode === "login" ? "Welcome back" : "Get started"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {mode === "login"
                        ? "Sign in securely to continue"
                        : "Set up in 60 seconds"}
                    </p>
                  </div>
                  <AuthStepIndicator current={step} total={totalSteps} />
                </div>

                {/* Mode switch */}
                <AuthModeSwitch mode={mode} />

                {/* Title */}
                <div className="mb-5 mt-5">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 xl:text-[1.75rem]">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Form */}
                {children}
              </div>

              {/* Footer */}
              <p className="mt-3 text-center text-[11px] text-slate-400">
                © {new Date().getFullYear()} Vitakart · Trusted wellness shopping
              </p>
            </div>
          </div>
        </main >
      </div >
    </>
  );
}