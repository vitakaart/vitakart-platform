// File: apps/web/components/coupons/coupon-section.tsx
// Complete coupon section — input + modal + apply/remove

"use client";

import { useState } from "react";
import { CouponInput } from "./coupon-input";
import { CouponsModal } from "./coupons-modal";
import { useApplyCoupon, useRemoveCoupon } from "@/lib/hooks/use-coupons";

interface CouponSectionProps {
  appliedCode?: string | null;
  disabled?: boolean;
}

export function CouponSection({ appliedCode, disabled }: CouponSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const applyMutation = useApplyCoupon();
  const removeMutation = useRemoveCoupon();

  const handleApply = (code: string) => {
    applyMutation.mutate(code);
  };

  const handleRemove = () => {
    removeMutation.mutate();
  };

  return (
    <>
      <CouponInput
        appliedCode={appliedCode}
        onApply={handleApply}
        onRemove={handleRemove}
        onOpenCouponsList={() => setModalOpen(true)}
        isApplying={applyMutation.isPending}
        isRemoving={removeMutation.isPending}
        disabled={disabled}
      />

      <CouponsModal
        isOpen={modalOpen}
        appliedCode={appliedCode}
        onClose={() => setModalOpen(false)}
        onApply={handleApply}
        isApplying={applyMutation.isPending}
      />
    </>
  );
}