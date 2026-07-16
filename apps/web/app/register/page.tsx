// File: apps/web/app/register/page.tsx
// Register page with strong password validation

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

// Validation schema (matches backend)
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
      .refine(
        (val) => !val || /^\+?[0-9]{10,15}$/.test(val),
        "Invalid phone number"
      ),
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
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isRegistering } = useAuth();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
    // Send only required fields to API
    registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone || undefined,
    });
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Vitakart for exclusive health & wellness benefits"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <FormInput
          label="Full Name"
          id="fullName"
          type="text"
          placeholder="John Doe"
          icon={<User className="w-4 h-4" />}
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
          icon={<Mail className="w-4 h-4" />}
          required
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Phone (Optional) */}
        <FormInput
          label="Phone Number (Optional)"
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          icon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password <span className="text-danger-500 ml-1">*</span>
          </label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.password?.message ? (
            <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
              <span>⚠</span>
              {errors.password.message}
            </p>
          ) : (
            <PasswordStrength password={password} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password <span className="text-danger-500 ml-1">*</span>
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
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

        {/* Terms Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              {...register("agreeToTerms")}
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I agree to Vitakart&apos;s{" "}
              <Link
                href={ROUTES.TERMS}
                className="text-primary-600 hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={ROUTES.PRIVACY}
                className="text-primary-600 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms?.message && (
            <p className="text-xs text-danger-500 mt-1 ml-6">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isRegistering}
          className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold"
        >
          {isRegistering ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// ==========================================
// PASSWORD STRENGTH INDICATOR
// ==========================================
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

  const strengthConfig = {
    weak: { color: "bg-danger-500", label: "Weak", width: "33%" },
    medium: { color: "bg-warning-500", label: "Medium", width: "66%" },
    strong: { color: "bg-success-500", label: "Strong", width: "100%" },
  };

  const config = strengthConfig[strength];

  return (
    <div className="space-y-2 mt-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${config.color}`}
            style={{ width: config.width }}
          />
        </div>
        <span
          className={`text-xs font-medium ${
            strength === "strong"
              ? "text-success-600"
              : strength === "medium"
              ? "text-warning-600"
              : "text-danger-600"
          }`}
        >
          {config.label}
        </span>
      </div>

      {/* Checks */}
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1 text-[11px] ${
              check.passed ? "text-success-600" : "text-gray-400"
            }`}
          >
            <span>{check.passed ? "✓" : "○"}</span>
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}