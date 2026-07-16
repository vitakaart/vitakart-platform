// File: apps/web/components/auth/form-input.tsx
// Reusable form input with icon and error message

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, error, required, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </Label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            id={id}
            className={cn(
              "h-11",
              icon && "pl-10",
              error && "border-danger-500 focus-visible:ring-danger-500",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";