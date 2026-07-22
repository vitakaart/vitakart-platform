// apps/web/app/account/profile/page.tsx
// Profile edit page — Update name & phone

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronRight,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountLayout } from "@/components/account/account-layout";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUpdateProfile } from "@/lib/hooks/use-profile";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid Indian mobile number")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Content ─────────────────────────────────────────────────────────────────

function ProfileContent() {
  const { user } = useAuth();
  const { updateProfile, isUpdating } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      fullName: data.fullName.trim(),
      phone: data.phone?.trim() || undefined,
    });
  };

  if (!user) return null;

  return (
    <>
      {/* Page Header */}
      <AccountPageHeader
        title="Profile Details"
        subtitle="Manage your personal information"
        backHref={ROUTES.ACCOUNT}
      />

      <div className="space-y-6">
        {/* ═══════════════════════════════════
            AVATAR CARD
        ═══════════════════════════════════ */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {user.fullName}
              </h2>
              <p className="mt-0.5 truncate text-sm text-slate-500">
                {user.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  {user.role}
                </span>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    <ShieldCheck className="h-2.5 w-2.5" strokeWidth={3} />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Photo upload coming soon */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-3">
            <span className="text-lg">📸</span>
            <p className="text-xs font-medium text-slate-500">
              Profile photo upload
            </p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
              Soon
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════
            FORM CARD
        ═══════════════════════════════════ */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Personal Information
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Update your name and contact details
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-[13px] font-semibold text-slate-700"
              >
                Full Name <span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="group relative">
                <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className={cn(
                    "h-12 rounded-2xl border-slate-200 bg-slate-50/80 pl-11 pr-4 text-slate-900 text-sm placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500/15 focus-visible:bg-white transition-all",
                    errors.fullName &&
                      "border-red-300 bg-red-50/60 focus-visible:border-red-400 focus-visible:ring-red-500/15"
                  )}
                  {...register("fullName")}
                />
              </div>
              {errors.fullName?.message && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <span>⚠</span>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[13px] font-semibold text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-12 cursor-not-allowed rounded-2xl border-slate-200 bg-slate-100 pl-11 pr-4 text-sm text-slate-500"
                />
                <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <Lock className="h-3 w-3" />
                Email cannot be changed for security reasons
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-[13px] font-semibold text-slate-700"
              >
                Phone Number
              </label>
              <div className="group relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <div className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 border-r border-slate-200 pr-2 text-sm font-medium text-slate-500">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={cn(
                    "h-12 rounded-2xl border-slate-200 bg-slate-50/80 pl-[68px] pr-4 text-slate-900 text-sm placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500/15 focus-visible:bg-white transition-all",
                    errors.phone &&
                      "border-red-300 bg-red-50/60 focus-visible:border-red-400 focus-visible:ring-red-500/15"
                  )}
                  {...register("phone")}
                />
              </div>
              {errors.phone?.message && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <span>⚠</span>
                  {errors.phone.message}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Used for order updates and delivery notifications
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <Button
                type="submit"
                disabled={isUpdating || !isDirty}
                className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-12 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Link href={ROUTES.ACCOUNT}>Cancel</Link>
              </Button>
            </div>
          </form>
        </div>

        {/* ═══════════════════════════════════
            ADDITIONAL ACTIONS
        ═══════════════════════════════════ */}
        <div>
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Security & Access
          </p>

          <div className="space-y-2.5">
            <Link
              href="/account/change-password"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Lock className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  Change Password
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Update your account password securely
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-700" />
            </Link>

            <Link
              href="/account/security"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  Security Settings
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Two-factor auth, login history & more
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-700" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <AccountLayout>
      <ProfileContent />
    </AccountLayout>
  );
}