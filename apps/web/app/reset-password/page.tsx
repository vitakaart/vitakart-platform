// File: apps/web/app/reset-password/page.tsx
// Reset password page — user clicks link from email

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordInput } from "@/components/auth/password-input";
import { ROUTES } from "@/lib/constants/routes";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Invalid/missing token
  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This reset link is invalid or expired">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-danger-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-700 mb-2">
              The password reset link is invalid or has expired.
            </p>
            <p className="text-sm text-gray-500">
              Please request a new password reset link.
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full h-11 bg-primary-500 hover:bg-primary-600">
              <Link href={ROUTES.FORGOT_PASSWORD}>
                Request New Link
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-11">
              <Link href={ROUTES.LOGIN}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Add backend API call when ready
      // await authApi.resetPassword({ token, password: data.password });

      // Placeholder — simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <AuthLayout title="Password Reset!" subtitle="Your password has been updated">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-success-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-700">
              You can now login with your new password.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login...
            </p>
          </div>

          <Button asChild className="w-full h-11 bg-primary-500 hover:bg-primary-600">
            <Link href={ROUTES.LOGIN}>Go to Login</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Choose a strong password for your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Info box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Password Requirements:</p>
            <ul className="text-xs space-y-0.5 text-gray-600">
              <li>• At least 8 characters</li>
              <li>• Uppercase & lowercase letters</li>
              <li>• At least one number</li>
              <li>• At least one special character</li>
            </ul>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            New Password <span className="text-danger-500 ml-1">*</span>
          </label>
          <PasswordInput
            id="password"
            placeholder="Enter new password"
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm New Password <span className="text-danger-500 ml-1">*</span>
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
              <span>⚠</span>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              Reset Password
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}