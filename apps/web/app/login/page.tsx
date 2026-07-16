// File: apps/web/app/login/page.tsx
// Login page with form validation and backend integration

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { PasswordInput } from "@/components/auth/password-input";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const { isAuthenticated } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit = (data: LoginFormData) => {
  login(data);
};

// Get redirect URL from query params
useEffect(() => {
  if (isAuthenticated) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    router.push(redirect || ROUTES.HOME);
  }
}, [isAuthenticated, router]);

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Login to continue your wellness journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          required
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password <span className="text-danger-500 ml-1">*</span>
            </label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium"
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
            <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
              <span>⚠</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-sm text-gray-600 cursor-pointer select-none"
          >
            Keep me signed in
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoggingIn}
          className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-500">or</span>
          </div>
        </div>

        {/* Google Sign In (UI Only for now) */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 text-sm font-medium border-gray-200 hover:bg-gray-50"
          disabled
        >
          <GoogleIcon />
          <span className="ml-2">Continue with Google</span>
          <span className="ml-auto text-xs text-gray-400">Soon</span>
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// Google icon
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}