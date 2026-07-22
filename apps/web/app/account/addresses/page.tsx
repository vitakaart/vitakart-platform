// apps/web/app/account/addresses/page.tsx
// Manage all user addresses

"use client";

import { useState } from "react";
import { MapPin, Plus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountLayout } from "@/components/account/account-layout";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AddressCard } from "@/components/addresses/address-card";
import { EmptyState } from "@/components/shared/empty-state";
import { AddressFormModal } from "@/components/addresses/address-form-modal";
import { DeleteAddressModal } from "@/components/addresses/delete-address-modal";
import {
  useMyAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/lib/hooks/use-addresses";
import { ROUTES } from "@/lib/constants/routes";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/api";

// ─── Content ─────────────────────────────────────────────────────────────────

function AddressesContent() {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const { data: addresses, isLoading, isError, refetch } = useMyAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const totalAddresses = addresses?.length ?? 0;
  const defaultAddress = addresses?.find((a) => a.isDefault);

  // ─── Handlers ───
  const handleAddNew = () => {
    setEditingAddress(null);
    setFormModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormModalOpen(false);
    setEditingAddress(null);
  };

  const handleSubmitForm = (data: CreateAddressInput | UpdateAddressInput) => {
    if (editingAddress) {
      updateMutation.mutate(
        { id: editingAddress.id, data: data as UpdateAddressInput },
        { onSuccess: handleCloseModal }
      );
    } else {
      createMutation.mutate(data as CreateAddressInput, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingAddress) return;
    deleteMutation.mutate(deletingAddress.id, {
      onSuccess: () => setDeletingAddress(null),
    });
  };

  const handleSetDefault = (address: Address) => {
    setDefaultMutation.mutate(address.id);
  };

  // Build subtitle
  const subtitle = (() => {
    if (isLoading) return "Loading your addresses...";
    if (totalAddresses === 0) return "Manage your delivery locations";
    if (defaultAddress) {
      return `${totalAddresses} ${totalAddresses === 1 ? "address" : "addresses"} · ${defaultAddress.label || "Default"} set as primary`;
    }
    return `${totalAddresses} ${totalAddresses === 1 ? "address" : "addresses"} saved`;
  })();

  return (
    <>
      {/* Page Header */}
      <AccountPageHeader
        title="My Addresses"
        subtitle={subtitle}
        backHref={ROUTES.ACCOUNT}
        action={
          <Button
            onClick={handleAddNew}
            className="hidden h-11 items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all hover:from-emerald-600 hover:to-emerald-700 active:scale-95 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        }
      />

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <ErrorView onRetry={refetch} />
      ) : !addresses || addresses.length === 0 ? (
        <EmptyView onAddNew={handleAddNew} />
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={setDeletingAddress}
              onSetDefault={handleSetDefault}
              isSettingDefault={setDefaultMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Mobile Floating Add Button */}
      {!isLoading && addresses && addresses.length > 0 && (
        <button
          onClick={handleAddNew}
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 sm:hidden"
          aria-label="Add new address"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      )}

      {/* Form Modal (Add/Edit) */}
      <AddressFormModal
        address={editingAddress}
        isOpen={formModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteAddressModal
        address={deletingAddress}
        isOpen={!!deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}

// ─── Sub Components ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-1/5 rounded bg-slate-100" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <MapPin className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900">
        Failed to load addresses
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Something went wrong. Please try again.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="mt-4 rounded-full border-slate-200"
      >
        Try Again
      </Button>
    </div>
  );
}

function EmptyView({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
        <Home className="h-8 w-8 text-white" strokeWidth={2} />
      </div>

      <h3 className="text-xl font-bold text-slate-900">No addresses yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Add your first delivery address to get started with ordering wellness
        products.
      </p>

      <Button
        onClick={onAddNew}
        className="mt-6 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all hover:from-emerald-600 hover:to-emerald-700 active:scale-95"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Address
      </Button>
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function AddressesPage() {
  return (
    <AccountLayout>
      <AddressesContent />
    </AccountLayout>
  );
}