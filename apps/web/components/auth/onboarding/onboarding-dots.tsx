// apps/web/components/auth/onboarding/onboarding-dots.tsx
"use client";

import { cn } from "@/lib/utils";

interface OnboardingDotsProps {
  total: number;
  current: number;
  className?: string;
  theme?: "light" | "dark";
}

export function OnboardingDots({
  total,
  current,
  className,
  theme = "light",
}: OnboardingDotsProps) {
  const isDark = theme === "dark";

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isPast = i < current;

        return (
          <span
            key={i}
            className={cn(
              "h-2.5 rounded-full transition-all duration-500 ease-out",
              isActive
                ? isDark
                  ? "w-8 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : "w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                : isPast
                ? isDark
                  ? "w-2.5 bg-emerald-300"
                  : "w-2.5 bg-white/60"
                : isDark
                ? "w-2.5 bg-slate-300"
                : "w-2.5 bg-white/25"
            )}
          />
        );
      })}
    </div>
  );
}