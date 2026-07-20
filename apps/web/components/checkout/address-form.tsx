"use client";

import { MapPin, User, Phone, Home, Building2, Landmark, MapPinned, StickyNote, AlertCircle } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormData } from "@/app/checkout/page";

interface Props {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

function FormField({
  label,
  required,
  icon: Icon,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  icon: typeof User;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A] uppercase tracking-[0.08em] mb-2">
        <Icon className="w-3.5 h-3.5 text-primary-500" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 mt-1.5 animate-fade-in">
          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-500 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

export function AddressForm({ register, errors }: Props) {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0A0A0A]">Shipping Address</h2>
          <p className="text-xs text-[#6B665D]">Where should we deliver your wellness products?</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <FormField
          label="Full Name"
          required
          icon={User}
          error={errors.fullName?.message}
          className="md:col-span-2"
        >
          <input
            {...register("fullName")}
            type="text"
            placeholder="John Doe"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* Phone */}
        <FormField label="Phone Number" required icon={Phone} error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            placeholder="9876543210"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* Pincode */}
        <FormField label="Pincode" required icon={MapPinned} error={errors.pincode?.message}>
          <input
            {...register("pincode")}
            type="text"
            maxLength={6}
            placeholder="110001"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium tracking-widest"
          />
        </FormField>

        {/* Address Line 1 */}
        <FormField
          label="Address Line 1"
          required
          icon={Home}
          error={errors.addressLine1?.message}
          className="md:col-span-2"
        >
          <input
            {...register("addressLine1")}
            type="text"
            placeholder="House No, Building, Street"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* Address Line 2 */}
        <FormField
          label="Address Line 2"
          icon={Building2}
          className="md:col-span-2"
        >
          <input
            {...register("addressLine2")}
            type="text"
            placeholder="Area, Colony, Apartment"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* Landmark */}
        <FormField label="Landmark" icon={Landmark} className="md:col-span-2">
          <input
            {...register("landmark")}
            type="text"
            placeholder="Near Metro Station, Mall, etc."
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* City */}
        <FormField label="City" required icon={MapPinned} error={errors.city?.message}>
          <input
            {...register("city")}
            type="text"
            placeholder="New Delhi"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* State */}
        <FormField label="State" required icon={MapPinned} error={errors.state?.message}>
          <input
            {...register("state")}
            type="text"
            placeholder="Delhi"
            className="w-full h-12 px-4 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
          />
        </FormField>

        {/* Customer Notes */}
        <FormField label="Delivery Instructions" icon={StickyNote} className="md:col-span-2">
          <textarea
            {...register("customerNotes")}
            rows={3}
            placeholder="Ring the bell twice, leave at door, call before delivery..."
            className="w-full px-4 py-3 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium resize-none"
          />
        </FormField>
      </div>
    </div>
  );
}