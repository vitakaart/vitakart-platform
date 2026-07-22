// apps/web/components/auth/auth-social-button.tsx

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthSocialButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  badge?: string;
}

export function AuthSocialButton({
  icon,
  label,
  badge,
  className,
  type = "button",
  ...props
}: AuthSocialButtonProps) {
  return (
    <Button
      type={type}
      variant="outline"
      size="lg"
      className={cn(
        "h-12 w-full rounded-2xl border-slate-200 bg-white",
        "text-sm font-semibold text-slate-700",
        "shadow-[0_2px_8px_rgba(15,23,42,0.06)]",
        "hover:bg-slate-50 transition-all duration-200",
        className
      )}
      {...props}
    >
      <span className="flex items-center">{icon}</span>
      <span className="ml-2 flex-1 text-left">{label}</span>
      {badge && (
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {badge}
        </span>
      )}
    </Button>
  );
}