// File: apps/web/lib/hooks/use-addresses.ts
// React Query hooks for addresses

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addressesApi } from "@/lib/api/addresses";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/api";

const ADDRESSES_KEY = ["addresses"];
const DEFAULT_ADDRESS_KEY = ["addresses", "default"];

// ==========================================
// GET ALL ADDRESSES
// ==========================================
export function useMyAddresses() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: () => addressesApi.getMyAddresses(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 min
  });
}

// ==========================================
// GET DEFAULT ADDRESS (for checkout auto-fill)
// ==========================================
export function useDefaultAddress() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: DEFAULT_ADDRESS_KEY,
    queryFn: () => addressesApi.getDefault(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

// ==========================================
// GET SINGLE ADDRESS
// ==========================================
export function useAddress(id: string | undefined) {
  return useQuery({
    queryKey: ["addresses", id],
    queryFn: () => addressesApi.getById(id!),
    enabled: !!id,
  });
}

// ==========================================
// CREATE ADDRESS
// ==========================================
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressInput) => addressesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_ADDRESS_KEY });
      toast.success("Address added successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// UPDATE ADDRESS
// ==========================================
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAddressInput;
    }) => addressesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_ADDRESS_KEY });
      toast.success("Address updated successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// SET DEFAULT ADDRESS
// ==========================================
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesApi.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_ADDRESS_KEY });
      toast.success("Default address updated!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ==========================================
// DELETE ADDRESS
// ==========================================
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_ADDRESS_KEY });
      toast.success("Address deleted successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}