// File: apps/web/lib/api/addresses.ts
// All address-related API calls

import apiClient from "./client";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/api";

export const addressesApi = {
  // Get all user addresses
  getMyAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>("/addresses");
    return response.data;
  },

  // Get default address
  getDefault: async (): Promise<Address | null> => {
    try {
      const response = await apiClient.get<Address>("/addresses/default");
      return response.data;
    } catch {
      return null; // No default set
    }
  },

  // Get single address by ID
  getById: async (id: string): Promise<Address> => {
    const response = await apiClient.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  // Create new address
  create: async (data: CreateAddressInput): Promise<Address> => {
    const response = await apiClient.post<Address>("/addresses", data);
    return response.data;
  },

  // Update existing address
  update: async (
    id: string,
    data: UpdateAddressInput
  ): Promise<Address> => {
    const response = await apiClient.put<Address>(`/addresses/${id}`, data);
    return response.data;
  },

  // Set as default
  setDefault: async (id: string): Promise<Address> => {
    const response = await apiClient.patch<Address>(
      `/addresses/${id}/set-default`
    );
    return response.data;
  },

  // Delete address
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`);
  },
};