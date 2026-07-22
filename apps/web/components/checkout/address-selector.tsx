// File: apps/web/components/checkout/address-selector.tsx
// Address selection UI for checkout

"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Loader2, AlertCircle } from "lucide-react";
import { AddressCardMini } from "./address-card-mini";
import { AddressFormModal } from "@/components/addresses/address-form-modal";
import {
  useMyAddresses,
  useCreateAddress,
} from "@/lib/hooks/use-addresses";
import type { Address, CreateAddressInput } from "@/types/api";

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelect: (address: Address) => void;
}

export function AddressSelector({
  selectedAddressId,
  onSelect,
}: AddressSelectorProps) {
  const { data: addresses, isLoading, isError, refetch } = useMyAddresses();
  const createMutation = useCreateAddress();
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-select default address on load
  useEffect(() => {
    if (!selectedAddressId && addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      onSelect(defaultAddr);
    }
  }, [addresses, selectedAddressId, onSelect]);

  const handleAddNewAddress = (data: CreateAddressInput) => {
    createMutation.mutate(data, {
      onSuccess: (newAddress) => {
        setModalOpen(false);
        onSelect(newAddress); // Auto-select the new address
      },
    });
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isLoading) {
    return (
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0A0A0A]">
              Shipping Address
            </h2>
            <p className="text-xs text-[#6B665D]">Loading your addresses...</p>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#F5F1E8] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (isError) {
    return (
      <div className="bg-[#FFFDF8] rounded-2xl border border-red-200 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-red-600">
            Failed to load addresses
          </h2>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm text-primary-600 font-semibold hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  const hasAddresses = addresses && addresses.length > 0;

  return (
    <>
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">
                Shipping Address
              </h2>
              <p className="text-xs text-[#6B665D]">
                {hasAddresses
                  ? "Select delivery address"
                  : "Add your first delivery address"}
              </p>
            </div>
          </div>

          {hasAddresses && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          )}
        </div>

        {/* Content */}
        {!hasAddresses ? (
          // Empty state
          <EmptyState onAddNew={() => setModalOpen(true)} />
        ) : (
          <>
            {/* Address Cards */}
            <div className="space-y-3">
              {addresses.map((address) => (
                <AddressCardMini
                  key={address.id}
                  address={address}
                  selected={selectedAddressId === address.id}
                  onSelect={() => onSelect(address)}
                />
              ))}
            </div>

            {/* Mobile Add Button */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="sm:hidden w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary-300 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </>
        )}
      </div>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddNewAddress}
        isSubmitting={createMutation.isPending}
      />
    </>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================
function EmptyState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="text-base font-bold text-[#0A0A0A] mb-2">
        No addresses saved yet
      </h3>
      <p className="text-sm text-[#6B665D] mb-4 max-w-md mx-auto">
        Add your first delivery address to continue with checkout
      </p>
      <button
        type="button"
        onClick={onAddNew}
        className="inline-flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add New Address
      </button>
    </div>
  );
}