// File: apps/web/app/page.tsx
// Home page with full layout

"use client";

import { Leaf, Sparkles, Truck, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ROUTES } from "@/lib/constants/routes";

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 md:py-20">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-primary-200 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>New season, new you</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Premium Health &<br />
              <span className="text-primary-600">Wellness Products</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover authentic supplements, vitamins, and nutrition products
              curated for your wellness journey.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-primary-500 hover:bg-primary-600 text-white text-base h-12 px-8"
              >
                <Link href={ROUTES.PRODUCTS}>
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base h-12 px-8"
              >
                <Link href={ROUTES.CATEGORIES}>Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 md:py-12 border-y border-gray-100">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Feature
              icon={Truck}
              title="Free Shipping"
              description="On orders above ₹499"
            />
            <Feature
              icon={Shield}
              title="100% Authentic"
              description="Verified products"
            />
            <Feature
              icon={Leaf}
              title="Natural & Pure"
              description="Handpicked quality"
            />
            <Feature
              icon={Sparkles}
              title="Easy Returns"
              description="7-day return policy"
            />
          </div>
        </div>
      </section>

      {/* Placeholder for future sections */}
      <section className="py-16 md:py-24">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-8">
              Product listings, categories, and shopping features are being
              built. Layout & navigation are ready! 🎉
            </p>

            {/* Status */}
            <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 text-left">
              <h3 className="font-semibold text-lg mb-4 text-primary-900">
                ✅ Layout Complete
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Responsive Navbar (Desktop + Mobile)</li>
                <li>✅ Mobile Bottom Navigation</li>
                <li>✅ Beautiful Footer</li>
                <li>✅ Announcement Bar</li>
                <li>✅ Mobile Slide-out Menu</li>
                <li>✅ Search Bar</li>
                <li>✅ Cart & Wishlist Icons</li>
                <li>✅ User Menu (dynamic based on auth)</li>
              </ul>
              <p className="mt-4 text-sm text-primary-700 font-medium">
                🎯 Next: Auth Pages (Login, Register)
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

// Feature component
function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}