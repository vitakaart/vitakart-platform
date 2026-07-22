// apps/web/app/login/page.tsx
// FIXED VERSION

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { PasswordInput } from "@/components/auth/password-input";
import { AuthSocialButton } from "@/components/auth/auth-social-button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore, useIsHydrated } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const isHydrated = useIsHydrated();
  const hasRedirected = useRef(false);

  // ✅ Only redirect if already logged in on page load (not during login)
  useEffect(() => {
    // Wait for hydration to complete
    if (!isHydrated) return;
    
    // Don't redirect if already redirecting
    if (hasRedirected.current) return;
    
    // Don't redirect if login is in progress
    if (isLoggingIn) return;

    // Redirect if authenticated
    if (isAuthenticated) {
      hasRedirected.current = true;
      const params = new URLSearchParams(window.location.search);
      router.replace(params.get("redirect") || ROUTES.HOME);
    }
  }, [isAuthenticated, isHydrated, isLoggingIn, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("🔐 Submitting login:", { email: data.email });
    login(data);
  };

  return (
    <AuthLayout mode="login" currentStep={1} totalSteps={2} title="" subtitle="">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[13px] font-semibold text-slate-700">
              Password <span className="ml-1 text-red-500">*</span>
            </label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-semibold text-primary-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span>⚠</span> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me */}
        <label
          htmlFor="remember"
          className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <span className="flex items-center gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            Keep me signed in
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 shadow-sm">
            Secure
          </span>
        </label>

        <Button
          type="submit"
          disabled={isLoggingIn}
          size="lg"
          className="h-12 w-full rounded-2xl bg-primary-500 text-base font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400">or continue with</span>
          </div>
        </div>

        <AuthSocialButton
          icon={<GoogleIcon />}
          label="Continue with Google"
          badge="Soon"
          disabled
        />

        <p className="pt-1 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.REGISTER} className="font-semibold text-primary-600 hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}