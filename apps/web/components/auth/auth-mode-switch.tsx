// apps/web/components/auth/auth-mode-switch.tsx

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

interface AuthModeSwitchProps {
  mode: "login" | "register";
}

const TABS = [
  { key: "login",    label: "Sign In",       href: ROUTES.LOGIN    },
  { key: "register", label: "Create Account", href: ROUTES.REGISTER },
] as const;

export function AuthModeSwitch({ mode }: AuthModeSwitchProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1.5">
      {TABS.map((tab) => {
        const isActive = tab.key === mode;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-white text-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.1)]"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}