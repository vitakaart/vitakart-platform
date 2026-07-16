// File: apps/web/app/account/change-password/page.tsx
// Change password page (from profile)

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { PasswordInput } from "@/components/auth/password-input";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ROUTES } from "@/lib/constants/routes";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current",
    path: ["newPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

function ChangePasswordContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Add backend API call when ready
      // await authApi.changePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });

      // Placeholder — simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Password changed successfully!");
      reset();
      router.push(ROUTES.ACCOUNT);
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
      console.error("Change password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-10 max-w-2xl">
        {/* Back button */}
        <Link
          href={ROUTES.ACCOUNT}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Change Password
          </h1>
          <p className="text-sm text-gray-600">
            Update your password to keep your account secure
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Security tip */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Password Tips:</p>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• Use a unique password not used elsewhere</li>
                  <li>• Include uppercase, lowercase, numbers & symbols</li>
                  <li>• Avoid personal info (name, birthday)</li>
                  <li>• Longer passwords are more secure</li>
                </ul>
              </div>
            </div>

            {/* Current Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium text-gray-700"
              >
                Current Password <span className="text-danger-500 ml-1">*</span>
              </label>
              <PasswordInput
                id="currentPassword"
                placeholder="Enter current password"
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
              />
              {errors.currentPassword?.message && (
                <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password <span className="text-danger-500 ml-1">*</span>
              </label>
              <PasswordInput
                id="newPassword"
                placeholder="Enter new password"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              {errors.newPassword?.message && (
                <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password{" "}
                <span className="text-danger-500 ml-1">*</span>
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-11"
              >
                <Link href={ROUTES.ACCOUNT}>Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePasswordContent />
    </ProtectedRoute>
  );
}