// File: apps/web/app/forgot-password/page.tsx
// Forgot password page — REAL API integrated

"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { authApi } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { ROUTES } from "@/lib/constants/routes";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const response = await authApi.forgotPassword({ email: data.email });

      setSentEmail(data.email);
      setIsEmailSent(true);

      // DEV MODE: If backend returned reset URL, show it
      if (response.resetUrl) {
        setDevResetUrl(response.resetUrl);
      }

      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("Forgot password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUrl = () => {
    if (devResetUrl) {
      navigator.clipboard.writeText(devResetUrl);
      toast.success("URL copied to clipboard");
    }
  };

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================
  if (isEmailSent) {
    return (
      <AuthLayout
        mode="login"
        title="Check Your Email"
        subtitle="We've sent password reset instructions"
      >
        <div className="space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              We&apos;ve sent a password reset link to:
            </p>
            <p className="font-semibold text-primary-600 break-all">
              {sentEmail}
            </p>
          </div>

          {/* Info box */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>What&apos;s next?</strong>
            </p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the reset link</li>
              <li>Create a new password</li>
              <li>Login with your new password</li>
            </ol>
            <p className="text-xs text-gray-500 mt-2">
              ⏰ Link expires in 15 minutes
            </p>
          </div>

          {/* ==========================================
              DEV MODE: Show reset URL for testing
              TODO: Remove when email service is ready
              ========================================== */}
          {devResetUrl && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-yellow-900">
                    DEVELOPMENT MODE
                  </p>
                  <p className="text-xs text-yellow-800 mt-0.5">
                    Email service not configured. Use this link to test:
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-2 border border-yellow-200 flex items-center gap-2 mt-2">
                <code className="text-[10px] text-gray-700 break-all flex-1 font-mono">
                  {devResetUrl}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className="shrink-0 p-1.5 hover:bg-yellow-100 rounded transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-3.5 h-3.5 text-yellow-700" />
                </button>
              </div>

              <a
                href={devResetUrl}
                className="mt-2 block text-center text-xs font-bold text-yellow-900 bg-yellow-200 hover:bg-yellow-300 py-2 rounded-lg transition-colors"
              >
                Open Reset Link →
              </a>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => {
                setIsEmailSent(false);
                setDevResetUrl(null);
              }}
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              try again
            </button>
          </p>

          {/* Back to login */}
          <Button asChild variant="outline" className="w-full h-11">
            <Link href={ROUTES.LOGIN}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // ==========================================
  // FORM SCREEN
  // ==========================================
  return (
    <AuthLayout
      mode="login"
      title="Forgot Password?"
      subtitle="Enter your email to receive a password reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Back to login */}
        <Link
          href={ROUTES.LOGIN}
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </form>
    </AuthLayout>
  );
}