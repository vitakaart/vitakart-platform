// apps/web/app/register/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail, Phone, User } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { PasswordInput } from "@/components/auth/password-input";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email")
      .max(255, "Email is too long"),
    phone: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val.trim() === "") return true;
        // Remove spaces, dashes, brackets before validation
        const cleaned = val.replace(/[\s\-()]/g, "");
        return /^\+?[0-9]{10,15}$/.test(cleaned);
      }, "Invalid phone number (10-15 digits)"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "At least 8 characters")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isRegistering } = useAuth();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, router]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // Only validate after user leaves field
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = (data: RegisterFormData) => {
    // Clean phone number before sending
    const cleanedPhone = data.phone
      ? data.phone.replace(/[\s\-()]/g, "")
      : undefined;

    registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: cleanedPhone,
    });
  };

  return (
    <AuthLayout
      mode="register"
      currentStep={2}
      totalSteps={2}
      title=""
      subtitle=""
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <FormInput
          label="Full Name"
          id="fullName"
          type="text"
          placeholder="John Doe"
          icon={<User className="h-4 w-4" />}
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Email */}
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

        {/* Phone */}
        <FormInput
          label="Phone Number (Optional)"
          id="phone"
          type="tel"
          placeholder="+91 9876543210"
          icon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-[13px] font-semibold text-slate-700"
          >
            Password <span className="ml-1 text-red-500">*</span>
          </label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.password?.message ? (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span>⚠</span> {errors.password.message}
            </p>
          ) : (
            <PasswordStrength password={password} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-[13px] font-semibold text-slate-700"
          >
            Confirm Password <span className="ml-1 text-red-500">*</span>
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <span>⚠</span> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms — Using Controller for proper checkbox handling */}
        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs leading-relaxed text-slate-600">
                  I agree to Vitakart&apos;s{" "}
                  <Link
                    href={ROUTES.TERMS}
                    className="font-semibold text-primary-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={ROUTES.PRIVACY}
                    className="font-semibold text-primary-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms?.message && (
                <p className="ml-7 mt-2 text-xs text-red-500">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isRegistering}
          size="lg"
          className="h-12 w-full rounded-2xl bg-primary-500 text-base font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {/* Login link */}
        <p className="pt-1 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-primary-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// ─── Password Strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: "8+ characters", passed: password.length >= 8 },
    { label: "Uppercase", passed: /[A-Z]/.test(password) },
    { label: "Lowercase", passed: /[a-z]/.test(password) },
    { label: "Number", passed: /[0-9]/.test(password) },
    { label: "Special char", passed: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const strength =
    passedCount === 5 ? "strong" : passedCount >= 3 ? "medium" : "weak";

  const config = {
    weak:   { bar: "bg-red-500",     label: "Weak",   text: "text-red-600",     width: "w-1/3"  },
    medium: { bar: "bg-amber-500",   label: "Medium", text: "text-amber-600",   width: "w-2/3"  },
    strong: { bar: "bg-emerald-500", label: "Strong", text: "text-emerald-600", width: "w-full" },
  } as const;

  const c = config[strength];

  return (
    <div className="mt-2 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
      <div className="flex items-center gap-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${c.bar} ${c.width}`}
          />
        </div>
        <span className={`text-[11px] font-bold ${c.text}`}>{c.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-medium transition-colors ${
              check.passed
                ? "bg-emerald-50 text-emerald-700"
                : "border border-slate-200 bg-white text-slate-400"
            }`}
          >
            <span>{check.passed ? "✓" : "○"}</span>
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
}