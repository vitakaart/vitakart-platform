// File: apps/web/app/checkout/page.tsx
// Checkout with address selector integration

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  ClipboardCheck,
  CreditCard,
  Package,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AddressSelector } from "@/components/checkout/address-selector";
import { PaymentMethod } from "@/components/checkout/payment-method";
import { OrderItems } from "@/components/checkout/order-items";
import { Summary } from "@/components/checkout/summary";
import { useCart } from "@/lib/hooks/use-cart";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { ROUTES } from "@/lib/constants/routes";
import { PaymentMethod as PaymentMethodEnum } from "@/types/api";
import type { Address } from "@/types/api";
import { toast } from "sonner";

// ==========================================
// FORM VALIDATION SCHEMA (Only notes now)
// ==========================================
const checkoutSchema = z.object({
  customerNotes: z.string().max(500).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ==========================================
// STEP INDICATOR
// ==========================================
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Shipping", icon: ClipboardCheck },
    { num: 2, label: "Payment", icon: CreditCard },
    { num: 3, label: "Review", icon: Package },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-2 md:gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = step.num === currentStep;
          const isCompleted = step.num < currentStep;

          return (
            <div key={step.num} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 ${isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                    : isCompleted
                      ? "bg-primary-100 text-primary-700"
                      : "bg-[#F5F1E8] text-[#6B665D]"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive
                      ? "bg-white text-primary-600"
                      : isCompleted
                        ? "bg-primary-500 text-white"
                        : "bg-[#E9E1D2] text-[#6B665D]"
                    }`}
                >
                  {isCompleted ? "✓" : step.num}
                </div>
                <span className="hidden md:inline text-sm font-semibold">
                  {step.label}
                </span>
                <Icon className="w-4 h-4 md:hidden" />
              </div>
              {i < steps.length - 1 && (
                <ChevronRight
                  className={`w-4 h-4 mx-1 md:mx-2 ${isCompleted ? "text-primary-400" : "text-[#E9E1D2]"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// DELIVERY NOTES COMPONENT
// ==========================================
function DeliveryNotes({
  register,
}: {
  register: ReturnType<typeof useForm<CheckoutFormData>>["register"];
}) {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center">
          <StickyNote className="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0A0A0A]">
            Delivery Instructions
          </h2>
          <p className="text-xs text-[#6B665D]">
            Any special notes for the delivery? (Optional)
          </p>
        </div>
      </div>

      <textarea
        {...register("customerNotes")}
        rows={3}
        placeholder="Ring the bell twice, leave at door, call before delivery..."
        className="w-full px-4 py-3 rounded-xl border-2 border-[#E9E1D2] bg-white text-[#0A0A0A] placeholder:text-[#6B665D]/50 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium resize-none"
      />
    </div>
  );
}

// ==========================================
// MAIN CHECKOUT CONTENT
// ==========================================
function CheckoutContent() {
  const router = useRouter();
  const { cart, isEmpty, isLoading } = useCart();
  const createOrder = useCreateOrder();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(
    PaymentMethodEnum.COD
  );

  const idempotencyKey = useMemo(
    () => `checkout-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    []
  );

  const { register, handleSubmit } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // ==========================================
  // HANDLE ADDRESS SELECTION
  // ==========================================
  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  // ==========================================
  // EMPTY CART REDIRECT
  // ==========================================
  useEffect(() => {
    if (!isLoading && isEmpty) {
      router.push(ROUTES.CART);
    }
  }, [isLoading, isEmpty, router]);

  // Just return null while redirecting
  if (!isLoading && isEmpty) {
    return null;
  }

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isLoading || !cart) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary-100 animate-ping opacity-20" />
          </div>
          <p className="mt-4 text-sm text-[#6B665D] font-medium">
            Preparing your checkout...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ==========================================
  // PLACE ORDER
  // ==========================================
  const onSubmit = (data: CheckoutFormData) => {
    // Validate address selected
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      // Scroll to top to show address section
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentStep(3);

    createOrder.mutate({
      paymentMethod,
      idempotencyKey,
      // Address from selected saved address
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      addressLine1: selectedAddress.addressLine1,
      addressLine2: selectedAddress.addressLine2 || undefined,
      landmark: selectedAddress.landmark || undefined,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
      country: selectedAddress.country,
      // Delivery notes from form
      customerNotes: data.customerNotes,
    });
  };

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "HOME", href: ROUTES.HOME },
            { label: "CART", href: ROUTES.CART },
            { label: "CHECKOUT" },
          ]}
        />

        {/* Header */}
        <div className="mb-8 mt-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-[#6B665D] mt-2">
            Complete your wellness order in just a few steps
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-[1fr_420px] gap-8">
            {/* Left: Form Sections */}
            <div className="space-y-6">
              {/* Address Selector (replaces old form) */}
              <AddressSelector
                selectedAddressId={selectedAddress?.id || null}
                onSelect={handleAddressSelect}
              />

              {/* Payment Method */}
              <PaymentMethod
                selected={paymentMethod}
                onChange={setPaymentMethod}
              />

              {/* Delivery Notes */}
              <DeliveryNotes register={register} />

              {/* Order Items */}
              <OrderItems cart={cart} />
            </div>

            {/* Right: Summary (sticky) */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Summary
                cart={cart}
                onPlaceOrder={handleSubmit(onSubmit)}
                isSubmitting={createOrder.isPending}
                disabled={!selectedAddress}
              />
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}