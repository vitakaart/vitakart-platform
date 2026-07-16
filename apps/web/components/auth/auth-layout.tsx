// File: apps/web/components/auth/auth-layout.tsx
// Beautiful split-screen auth layout — branding on left, form on right

import Link from "next/link";
import { Heart, Shield, Sparkles, Truck } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const FEATURES = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Verified products from trusted brands",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above ₹499",
  },
  {
    icon: Sparkles,
    title: "Best Prices",
    description: "Exclusive member discounts",
  },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ==========================================
           LEFT SIDE — Branding (Desktop only)
           ========================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-primary-600 fill-primary-600" />
            </div>
            <span className="text-3xl font-bold">Vitakart</span>
          </Link>

          {/* Middle content */}
          <div className="my-12">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Your Health,
              <br />
              Our Priority
            </h1>
            <p className="text-lg text-primary-50 max-w-md">
              Join thousands of health enthusiasts who trust Vitakart for
              premium wellness products.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-primary-100">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==========================================
           RIGHT SIDE — Auth Form
           ========================================== */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b border-gray-100">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Vitakart</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600 text-sm sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form content */}
            {children}
          </div>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden p-4 text-center text-xs text-gray-500 border-t border-gray-100">
          © {new Date().getFullYear()} Vitakart. All rights reserved.
        </div>
      </div>
    </div>
  );
}