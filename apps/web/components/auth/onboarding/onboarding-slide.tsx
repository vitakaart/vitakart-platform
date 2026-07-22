// apps/web/components/auth/onboarding/onboarding-slide.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface OnboardingSlideProps {
  children: ReactNode;
  direction: number;
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function OnboardingSlide({ children, direction }: OnboardingSlideProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 350, damping: 35 },
        opacity: { duration: 0.25 },
      }}
      className="absolute inset-0 h-full w-full"
    >
      {children}
    </motion.div>
  );
}