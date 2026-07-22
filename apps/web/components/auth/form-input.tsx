// apps/web/components/auth/form-input.tsx

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, error, required, className, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {/* Label */}
        <Label
          htmlFor={id}
          className="text-[13px] font-semibold text-slate-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </Label>

        {/* Input wrapper */}
        <div className="relative group">
          {/* Left icon */}
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200">
              {icon}
            </div>
          )}

          <Input
            ref={ref}
            id={id}
            className={cn(
              // Base
              "h-12 w-full rounded-2xl border border-slate-200",
              "bg-slate-50/80 text-slate-900",
              "placeholder:text-slate-400 text-sm",
              "transition-all duration-200",
              // Shadow
              "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
              // Focus
              "focus-visible:border-primary-400",
              "focus-visible:ring-2 focus-visible:ring-primary-500/15",
              "focus-visible:bg-white",
              // Icon padding
              icon ? "pl-11" : "pl-4",
              "pr-4",
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
        </div>

        {/* Error message */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
            <span>⚠</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";