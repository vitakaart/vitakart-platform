// File: apps/web/app/account/profile/components/profile-form.tsx
// Name + Phone form

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/lib/hooks/use-profile";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import type { User } from "@/types/api";

// ==========================================
// VALIDATION SCHEMA
// ==========================================
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

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const { updateProfile, isUpdating } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      phone: user.phone || "",
    },
  });

  // Sync with user data
  useEffect(() => {
    reset({
      fullName: user.fullName || "",
      phone: user.phone || "",
    });
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(
      {
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || undefined,
        profileImage: user.profileImage || undefined,
      },
      {
        onSuccess: (updatedUser) => {
          setUser({
            ...user,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
          });
        },
      }
    );
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-8">
      {/* Header */}
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
        <FormFieldWithIcon
          label="Full Name"
          required
          icon={UserIcon}
          error={errors.fullName?.message}
        >
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className={cn(
              "h-12 rounded-2xl border-slate-200 bg-slate-50/80 pl-11 pr-4 text-slate-900 text-sm placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500/15 focus-visible:bg-white transition-all",
              errors.fullName && "border-red-300 bg-red-50/60"
            )}
            {...register("fullName")}
          />
        </FormFieldWithIcon>

        {/* Email (Read-only) */}
        <FormFieldWithIcon
          label="Email Address"
          icon={Mail}
          hint="Email cannot be changed for security reasons"
        >
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="h-12 cursor-not-allowed rounded-2xl border-slate-200 bg-slate-100 pl-11 pr-4 text-sm text-slate-500"
            />
            <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </FormFieldWithIcon>

        {/* Phone with +91 prefix */}
        <FormFieldWithIcon
          label="Phone Number"
          icon={Phone}
          error={errors.phone?.message}
          hint="Used for order updates and delivery notifications"
        >
          <div className="relative">
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
                errors.phone && "border-red-300 bg-red-50/60"
              )}
              {...register("phone")}
            />
          </div>
        </FormFieldWithIcon>

        {/* Action Buttons */}
        <ProfileFormActions
          isUpdating={isUpdating}
          isDirty={isDirty}
        />
      </form>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

interface FormFieldProps {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function FormFieldWithIcon({
  label,
  icon: Icon,
  required,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10" />
        {children}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <span>⚠</span>
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="flex items-center gap-1 text-xs text-slate-400">
          <Lock className="h-3 w-3" />
          {hint}
        </p>
      )}
    </div>
  );
}

interface FormActionsProps {
  isUpdating: boolean;
  isDirty: boolean;
}

function ProfileFormActions({ isUpdating, isDirty }: FormActionsProps) {
  return (
    <div className="flex flex-row gap-3 border-t border-slate-100 pt-6">
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
  );
}