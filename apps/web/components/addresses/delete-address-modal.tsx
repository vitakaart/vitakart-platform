// File: apps/web/components/addresses/delete-address-modal.tsx
// Confirmation modal for deleting address

"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types/api";

interface DeleteAddressModalProps {
  address: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteAddressModal({
  address,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteAddressModalProps) {
  if (!isOpen || !address) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full pointer-events-auto animate-scale-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-stone-500" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-danger-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-stone-900 text-center mb-2">
              Delete Address?
            </h2>
            <p className="text-sm text-stone-600 text-center mb-4">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>

            {/* Address Preview */}
            <div className="bg-stone-50 rounded-xl p-3 mb-6 text-sm">
              <p className="font-medium text-stone-900">{address.fullName}</p>
              <p className="text-stone-600 mt-1">
                {address.addressLine1}, {address.city}, {address.state} -{" "}
                {address.pincode}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 h-11 bg-danger-500 hover:bg-danger-600 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}