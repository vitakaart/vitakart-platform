// File: apps/web/components/auth/protected-route.tsx
// Wraps pages that require authentication
// Redirects to login if user not logged in

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore, useIsHydrated } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isHydrated = useIsHydrated();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Wait for hydration to complete
    if (!isHydrated) return;

    // If not logged in — redirect to login
    if (!isAuthenticated) {
      // Save current URL to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isHydrated, isAuthenticated, router]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}