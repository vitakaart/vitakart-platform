// File: apps/web/lib/stores/cart-store.ts
// Cart UI state (drawer open/close)
// Cart data comes from React Query

import { create } from "zustand";

interface CartUIState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartStore = create<CartUIState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));