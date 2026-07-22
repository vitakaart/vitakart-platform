// File: apps/web/components/addresses/address-form.tsx
// Address form — orchestrates all sub-components

"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "./form/form-field";
import { LocationDetector } from "./form/location-detector";
import { AddressTypeSelector } from "./form/address-type-selector";
import { PincodeField } from "./form/pincode-field";
import { OrDivider } from "./form/or-divider";
import {
  useAddressForm,
  type AddressFormData,
} from "./form/use-address-form";
import type { Address } from "@/types/api";
import type { AddressType } from "@/types/api";

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  showDefaultToggle?: boolean;
}

export function AddressForm({
  address,
  onSubmit,
  onCancel,
  isSubmitting,
  showDefaultToggle = true,
}: AddressFormProps) {
  const isEditMode = !!address;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    applyLocation,
    applyPincodeDetails,
  } = useAddressForm(address);

  const selectedType = watch("type");
  const pincodeValue = watch("pincode");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Location Detector (only for new addresses) */}
      {!isEditMode && (
        <>
          <LocationDetector onLocationDetected={applyLocation} />
          <OrDivider />
        </>
      )}

      {/* Address Type */}
      <AddressTypeSelector
        value={selectedType as AddressType}
        onChange={(type) => setValue("type", type)}
      />

      {/* Full Name */}
      <FormField
        label="Full Name"
        required
        placeholder="John Doe"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      {/* Phone */}
      <FormField
        label="Phone"
        required
        type="tel"
        placeholder="9876543210"
        maxLength={10}
        error={errors.phone?.message}
        {...register("phone")}
      />

      {/* Pincode (with auto-fetch) */}
      <PincodeField
        value={pincodeValue}
        error={errors.pincode?.message}
        originalValue={address?.pincode}
        onDetailsFound={applyPincodeDetails}
        register={register("pincode")}
      />

      {/* City + State */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="City"
          required
          placeholder="Mumbai"
          error={errors.city?.message}
          {...register("city")}
        />
        <FormField
          label="State"
          required
          placeholder="Maharashtra"
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      {/* Address Line 1 */}
      <FormField
        label="Address Line 1"
        required
        placeholder="House/Flat No, Building name"
        error={errors.addressLine1?.message}
        {...register("addressLine1")}
      />

      {/* Address Line 2 */}
      <FormField
        label="Address Line 2"
        placeholder="Street, Area, Colony (optional)"
        {...register("addressLine2")}
      />

      {/* Landmark */}
      <FormField
        label="Landmark"
        placeholder="Near XYZ (optional)"
        {...register("landmark")}
      />

      {/* Country */}
      <FormField
        label="Country"
        defaultValue="India"
        {...register("country")}
      />

      {/* Set as Default */}
      {showDefaultToggle && !isEditMode && (
        <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="w-4 h-4 text-primary-500 rounded"
          />
          <span className="text-sm text-stone-700">
            Set as default delivery address
          </span>
        </label>
      )}

      {/* Action Buttons */}
      <div className="flex flex-row sm:flex-row gap-3 pt-4 border-t border-stone-100">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isEditMode ? "Saving..." : "Adding..."}
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Add Address"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}