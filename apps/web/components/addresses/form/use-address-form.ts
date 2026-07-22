// File: apps/web/components/addresses/form/use-address-form.ts
// FIX: Wrap functions in useCallback

"use client";

import { useCallback, useEffect } from "react";  // ← ADD useCallback
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Address } from "@/types/api";
import type { LocationDetails } from "@/lib/utils/location";

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name too short")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid Indian mobile number"),
  addressLine1: z
    .string()
    .min(5, "Address too short")
    .max(200, "Address too long"),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  landmark: z.string().max(100).optional().or(z.literal("")),
  city: z.string().min(1, "City required").max(50, "City name too long"),
  state: z.string().min(1, "State required").max(50, "State name too long"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit pincode"),
  country: z.string().max(50).optional(),
  type: z.enum(["Home", "Office", "Other"]),
  isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export function useAddressForm(address?: Address | null) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      type: "Home",
      isDefault: false,
    },
  });

  const { setValue, trigger, reset } = form;

  // Populate form in edit mode
  useEffect(() => {
    if (address) {
      reset({
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        landmark: address.landmark || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        type: address.type,
        isDefault: address.isDefault,
      });
    }
  }, [address, reset]);

  // ✅ WRAP in useCallback — stable reference
  const applyLocation = useCallback(
    async (location: LocationDetails) => {
      if (location.addressLine1) setValue("addressLine1", location.addressLine1);
      if (location.addressLine2) setValue("addressLine2", location.addressLine2);
      if (location.landmark) setValue("landmark", location.landmark);
      if (location.city) setValue("city", location.city);
      if (location.state) setValue("state", location.state);
      if (location.pincode) setValue("pincode", location.pincode);
      if (location.country) setValue("country", location.country);

      await trigger();
    },
    [setValue, trigger]
  );

  // ✅ WRAP in useCallback — stable reference
  const applyPincodeDetails = useCallback(
    (city: string, state: string) => {
      setValue("city", city, { shouldValidate: true });
      setValue("state", state, { shouldValidate: true });
    },
    [setValue]
  );

  return {
    ...form,
    applyLocation,
    applyPincodeDetails,
  };
}