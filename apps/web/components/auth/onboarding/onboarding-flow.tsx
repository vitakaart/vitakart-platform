// apps/web/components/auth/onboarding/onboarding-flow.tsx
"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { OnboardingDots } from "./onboarding-dots";
import { OnboardingSlide } from "./onboarding-slide";
import { SlideWelcome } from "./slide-welcome";
import { SlideFeatures } from "./slide-features";
import { SlideTrust } from "./slide-trust";

interface OnboardingFlowProps {
  mode: "login" | "register";
  children: ReactNode;
}

const SESSION_KEY = "vitakart_onboarding_session";
const TOTAL_SLIDES = 4;

export function OnboardingFlow({ mode, children }: OnboardingFlowProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.skippedOrCompleted) {
          setCurrentSlide(TOTAL_SLIDES - 1);
        }
      }
    } catch { }
    setReady(true);
  }, []);

  useEffect(() => {
    if (currentSlide === TOTAL_SLIDES - 1) {
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ skippedOrCompleted: true })
        );
      } catch { }
    }
  }, [currentSlide]);

  useEffect(() => {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.skippedOrCompleted) {
          setCurrentSlide(TOTAL_SLIDES - 1);
        }
      }
    } catch { }
  }, [pathname]);

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const goBack = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const skipToForm = useCallback(() => {
    setDirection(1);
    setCurrentSlide(TOTAL_SLIDES - 1);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-xl"
        >
          <Heart className="h-8 w-8 animate-pulse fill-white text-white" />
        </motion.div>
      </div>
    );
  }

  const isFormSlide = currentSlide === TOTAL_SLIDES - 1;
  const isOnboardingSlide = !isFormSlide;

  return (
    <div
      className={`relative h-screen w-full overflow-hidden ${isFormSlide
          ? "from-emerald-500 via-emerald-600 to-emerald-700"
          : "bg-white"
        }`}
    >
      {/* Blobs — only on form slide */}
      {isFormSlide && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-16 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 h-48 w-48 rounded-full bg-lime-300/10 blur-3xl" />
        </div>
      )}

      {/* ─── SLIDES — Full screen ─── */}
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait" custom={direction}>
          {currentSlide === 0 && (
            <OnboardingSlide key="welcome" direction={direction}>
              <SlideWelcome onNext={goNext} />
            </OnboardingSlide>
          )}

          {currentSlide === 1 && (
            <OnboardingSlide key="features" direction={direction}>
              <SlideFeatures onNext={goNext} onBack={goBack} />
            </OnboardingSlide>
          )}

          {currentSlide === 2 && (
            <OnboardingSlide key="trust" direction={direction}>
              <SlideTrust onNext={goNext} onBack={goBack} mode={mode} />
            </OnboardingSlide>
          )}

          {currentSlide === 3 && (
            <OnboardingSlide key="form" direction={direction}>
              <div className="flex h-full flex-col px-4 pb-6 pt-16">
                <div
                  className="overflow-y-auto rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.2)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200"
                  style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                  {children}
                </div>
              </div>
            </OnboardingSlide>
          )}
        </AnimatePresence>
      </div>

      {/* ─── TOP BAR — Absolute overlay on image ─── */}
      {isOnboardingSlide && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-5">
          <Link
            href={ROUTES.HOME}
            className="pointer-events-auto flex items-center gap-2"
          >
            <Image src="/logos/vitakart-transparent.png" alt="" width={100} height={100} />

          </Link>

          <button
            onClick={skipToForm}
            className="pointer-events-auto rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-md transition-colors hover:bg-white"
          >
            Skip
          </button>
        </div>
      )}

      {isFormSlide && (
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
                       <Image src="/logos/vitakart-transparent.png" alt="" width={100} height={100} />
         
          </Link>
        </div>
      )}

      {/* ─── DOTS — Absolute overlay at bottom ─── */}
      {isOnboardingSlide && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30">
          <OnboardingDots
            total={TOTAL_SLIDES}
            current={currentSlide}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}