"use client";

import { CreditCard, Wallet, Banknote, Lock, CheckCircle2 } from "lucide-react";
import { PaymentMethod as PaymentMethodEnum } from "@/types/api";

interface Props {
  selected: PaymentMethodEnum;
  onChange: (method: PaymentMethodEnum) => void;
}

const PAYMENT_METHODS = [
  {
    id: PaymentMethodEnum.Razorpay,
    name: "Online Payment",
    description: "Card, UPI, Wallet, NetBanking via Razorpay",
    icon: CreditCard,
    badge: "Recommended",
    available: true, // ✅ ENABLED
  },
  {
    id: PaymentMethodEnum.COD,
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
    badge: "Popular",
    available: true,
  },
  {
    id: PaymentMethodEnum.UPI,
    name: "UPI / QR Code",
    description: "Google Pay, PhonePe, Paytm, BHIM",
    icon: Wallet,
    badge: "Instant",
    available: false, // Coming soon
  },
];

export function PaymentMethod({ selected, onChange }: Props) {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0A0A0A]">Payment Method</h2>
          <p className="text-xs text-[#6B665D]">
            Choose your preferred payment option
          </p>
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 p-3 bg-primary-50/50 border border-primary-100 rounded-xl mb-5">
        <Lock className="w-4 h-4 text-primary-500 flex-shrink-0" />
        <p className="text-xs text-primary-700 font-medium">
          All transactions are encrypted and secure
        </p>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;
          const isDisabled = !method.available;

          return (
            <button
              key={method.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(method.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left group
                ${
                  isSelected
                    ? "border-primary-400 bg-primary-50/50 shadow-md shadow-primary-100"
                    : "border-[#E9E1D2] bg-white hover:border-primary-200 hover:shadow-sm"
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5"}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${
                    isSelected
                      ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                      : "bg-[#F5F1E8] text-[#6B665D] group-hover:bg-primary-50 group-hover:text-primary-600"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`font-bold text-sm ${
                      isSelected ? "text-primary-800" : "text-[#0A0A0A]"
                    }`}
                  >
                    {method.name}
                  </h3>
                  {method.badge && !isDisabled && (
                    <span
                      className={`
                        text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${
                          isSelected
                            ? "bg-primary-200 text-primary-800"
                            : "bg-accent-100 text-accent-700"
                        }
                      `}
                    >
                      {method.badge}
                    </span>
                  )}
                  {isDisabled && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F5F1E8] text-[#6B665D] rounded-full">
                      COMING SOON
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B665D] mt-0.5">
                  {method.description}
                </p>
              </div>

              {/* Selected indicator */}
              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${
                    isSelected
                      ? "border-primary-500 bg-primary-500"
                      : "border-[#E9E1D2] bg-white"
                  }
                `}
              >
                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}