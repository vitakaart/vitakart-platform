// apps/web/components/auth/password-input.tsx

"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative group">
        {/* Lock icon */}
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200" />

        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            // Base
            "h-12 w-full rounded-2xl border border-slate-200",
            "bg-slate-50/80 text-slate-900 text-sm",
            "pl-11 pr-12",
            "placeholder:text-slate-400",
            "transition-all duration-200",
            // Shadow
            "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
            // Focus
            "focus-visible:border-primary-400",
            "focus-visible:ring-2 focus-visible:ring-primary-500/15",
            "focus-visible:bg-white",
            // Error state
            error && [
              "border-red-300 bg-red-50/60",
              "focus-visible:border-red-400",
              "focus-visible:ring-red-500/15",
            ],
            className
          )}
          {...props}
        />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors duration-200"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";