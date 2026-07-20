"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ClipboardCheck, CreditCard, Package, ChevronRight } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AddressForm } from "@/components/checkout/address-form";
import { PaymentMethod } from "@/components/checkout/payment-method";
import { OrderItems } from "@/components/checkout/order-items";
import { Summary } from "@/components/checkout/summary";
import { useCart } from "@/lib/hooks/use-cart";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { ROUTES } from "@/lib/constants/routes";
import { PaymentMethod as PaymentMethodEnum } from "@/types/api";

// ==========================================
// FORM VALIDATION SCHEMA
// ==========================================
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone too long").regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
  addressLine1: z.string().min(1, "Address is required").max(200, "Address too long"),
  addressLine2: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),
  city: z.string().min(1, "City is required").max(50),
  state: z.string().min(1, "State is required").max(50),
  pincode: z.string().length(6, "Pincode must be 6 digits").regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
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
              <div className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                  : isCompleted
                  ? "bg-primary-100 text-primary-700"
                  : "bg-[#F5F1E8] text-[#6B665D]"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? "bg-white text-primary-600" : isCompleted ? "bg-primary-500 text-white" : "bg-[#E9E1D2] text-[#6B665D]"
                }`}>
                  {isCompleted ? "✓" : step.num}
                </div>
                <span className="hidden md:inline text-sm font-semibold">{step.label}</span>
                <Icon className="w-4 h-4 md:hidden" />
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className={`w-4 h-4 mx-1 md:mx-2 ${
                  isCompleted ? "text-primary-400" : "text-[#E9E1D2]"
                }`} />
              )}
            </div>
          );
        })}
      </div>
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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.COD);

  const idempotencyKey = useMemo(
    () => `checkout-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  // Auto-advance step based on form validity
  useEffect(() => {
    if (isValid && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [isValid, currentStep]);

  if (!isLoading && isEmpty) {
    router.push(ROUTES.CART);
    return null;
  }

  if (isLoading || !cart) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary-100 animate-ping opacity-20" />
          </div>
          <p className="mt-4 text-sm text-[#6B665D] font-medium">Preparing your checkout...</p>
        </div>
      </MainLayout>
    );
  }

  const onSubmit = (data: CheckoutFormData) => {
    setCurrentStep(3);
    createOrder.mutate({
      paymentMethod,
      idempotencyKey,
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      landmark: data.landmark,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: "India",
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
              <AddressForm register={register} errors={errors} />
              <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />
              <OrderItems cart={cart} />
            </div>

            {/* Right: Summary (sticky) */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Summary
                cart={cart}
                onPlaceOrder={handleSubmit(onSubmit)}
                isSubmitting={createOrder.isPending}
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