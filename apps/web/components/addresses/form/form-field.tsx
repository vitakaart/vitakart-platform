// File: apps/web/components/addresses/form/form-field.tsx
// Reusable input field with label + error

"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { label, error, hint, required, rightElement, className, ...props },
    ref
  ) => {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "h-11",
              rightElement && "pr-10",
              error && "border-danger-500 focus-visible:ring-danger-500",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-danger-500">⚠ {error}</p>
        ) : hint ? (
          <p className="text-xs text-stone-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";