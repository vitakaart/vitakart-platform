// File: apps/web/components/shared/error-state.tsx
// Reusable error state

import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again later",
  onRetry,
  size = "md",
  className,
}: ErrorStateProps) {
  const sizes = {
    sm: "p-6",
    md: "p-8",
    lg: "p-12",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] text-center",
        sizes[size],
        className
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>

      {/* Title */}
      <p className="text-sm text-[#0A0A0A] font-semibold">
        {title}
      </p>

      {/* Description */}
      {description && (
        <p className="text-xs text-[#6B665D] mt-1">
          {description}
        </p>
      )}

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#10B981] text-white text-xs font-bold hover:bg-[#10B981]/90 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Try Again
        </button>
      )}
    </div>
  );
}