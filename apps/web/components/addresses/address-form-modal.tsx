// File: apps/web/components/addresses/address-form-modal.tsx
// Modal wrapper — uses React Portal to escape nested forms

"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AddressForm } from "./address-form";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/api";

interface AddressFormModalProps {
  address?: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressInput | UpdateAddressInput) => void;
  isSubmitting?: boolean;
}

export function AddressFormModal({
  address,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddressFormModalProps) {
  const isEditMode = !!address;
  const [mounted, setMounted] = useState(false);

  // ✅ Portal setup (SSR-safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render on server or when closed
  if (!isOpen || !mounted) return null;

  // ✅ Modal content
  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col pointer-events-auto animate-slide-up sm:animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-stone-100 shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                {isEditMode ? "Edit Address" : "Add New Address"}
              </h2>
              <p className="text-sm text-stone-500 mt-0.5">
                {isEditMode
                  ? "Update your delivery details"
                  : "Add a new delivery address"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>

          {/* Body (scrollable) */}
          <div className="p-5 overflow-y-auto flex-1">
            <AddressForm
              address={address}
              onSubmit={onSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </>
  );

  // ✅ Render OUTSIDE parent form using React Portal
  return createPortal(modalContent, document.body);
}