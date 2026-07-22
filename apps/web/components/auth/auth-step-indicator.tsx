// apps/web/components/auth/auth-step-indicator.tsx

import { cn } from "@/lib/utils";

interface AuthStepIndicatorProps {
  current?: number;
  total?: number;
  theme?: "light" | "dark";
  className?: string;
}

export function AuthStepIndicator({
  current = 1,
  total = 2,
  theme = "light",
  className,
}: AuthStepIndicatorProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full px-3 py-2",
        isDark
          ? "bg-white/10 text-white backdrop-blur-md"
          : "bg-slate-100 text-slate-700",
        className
      )}
      aria-label={`Step ${current} of ${total}`}
    >
      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, index) => {
          const step = index + 1;
          const active = step <= current;

          return (
            <span
              key={step}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                active ? "w-6" : "w-2",
                active
                  ? isDark
                    ? "bg-white"
                    : "bg-primary-500"
                  : isDark
                  ? "bg-white/30"
                  : "bg-slate-300"
              )}
            />
          );
        })}
      </div>

      {/* Counter */}
      <span
        className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          isDark ? "text-white/70" : "text-slate-400"
        )}
      >
        {String(current).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
    </div>
  );
}