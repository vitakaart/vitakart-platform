// File: apps/web/components/home/hero-section.tsx

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const trustItems = [
  { icon: Users, title: "10K+", text: "Happy Customers" },
  { icon: ShieldCheck, title: "Premium", text: "Quality" },
  { icon: Truck, title: "Secure", text: "Checkout" },
  { icon: RotateCcw, title: "30-Day", text: "Easy Returns" },
];

export function HeroSlider() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full min-h-[70vh] overflow-hidden  bg-[url('/images/vitakart-home1.png')] bg-cover bg-no-repeat bg-[10%_150%] pt-4 pb-6 sm:min-h-[65vh] sm:pt-6 sm:pb-8"
    >
      <div className="absolute inset-0 " />

      <div className="container-app relative z-10">
        <div className="relative overflow-hidden lg:min-h-[500px]">
          <div className="grid grid-cols-1 items-center py-8 lg:h-[70dvh] lg:grid-cols-12 lg:py-0">
            <div className="flex flex-col justify-center px-6 sm:px-12 lg:col-span-7 lg:px-16">
              <span className="mb-4 inline-flex w-fit rounded-full bg-[#1A3C34] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:mb-6 sm:text-[11px]">
                New Collection
              </span>

              <h1
                id="hero-title"
                className="mb-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:mb-6 sm:text-5xl xl:text-6xl"
              >
                Good for you.
                <br />
                <span className="font-serif font-normal italic text-[#1A3C34]">
                  Good for every day.
                </span>
              </h1>

              <p className="mb-6 max-w-lg text-xs leading-relaxed text-muted/100 sm:mb-8 sm:text-base">
                Thoughtfully crafted products that bring balance, beauty and better choices into your everyday.
              </p>

              <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href={ROUTES.PRODUCTS}
                  aria-label="Shop collection"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1A3C34] px-8 text-xs font-bold !text-white transition-colors hover:bg-[#0A261F]"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={ROUTES.CATEGORIES}
                  aria-label="Explore new arrivals"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border/50 bg-white px-8 text-xs font-bold text-foreground shadow-sm transition-colors hover:bg-muted/30"
                >
                  Explore New Arrivals
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2" aria-hidden="true">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-7 w-7 rounded-full border-2 border-white bg-gray-200 sm:h-8 sm:w-8"
                    />
                  ))}
                </div>

                <div>
                  <p className="text-xs font-bold text-foreground">10K+ Happy Customers</p>
                  <p className="text-[10px] text-amber-600" aria-label="5 out of 5 rating">
                    ★★★★★
                  </p>
                </div>
              </div>
            </div>

            <div className="relative hidden h-full sm:block lg:col-span-5">
              <div className="absolute right-6 top-6 z-20 flex w-[200px] items-center gap-4 rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur-md lg:right-10 lg:top-10">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Editor&apos;s Pick
                  </p>
                  <h2 className="mt-0.5 text-sm font-serif font-bold text-foreground">
                    Signature Collection
                  </h2>
                  <p className="mt-1 text-sm font-bold text-[#1A3C34]">$48</p>
                </div>

                <button
                  type="button"
                  aria-label="Add Signature Collection to cart"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A3C34] text-white"
                >
                  +
                </button>
              </div>

              <a
                href="#home-trust"
                aria-label="Scroll to trust section"
                className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-colors hover:bg-muted hover:text-white lg:bottom-10 lg:right-10"
              >
                <ArrowDown className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          id="home-trust"
          className="mt-4 grid grid-cols-2 gap-4 rounded-[20px] bg-card/95 border border-[#E9E1D2] px-4 py-5 backdrop-blur-md sm:mt-6 sm:rounded-[24px] sm:px-8 sm:py-6 sm:backdrop-blur-none sm:gap-8 lg:grid-cols-4"
        >
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 sm:gap-4">
              <Icon className="h-5 w-5 shrink-0 text-[#1A3C34] sm:h-6 sm:w-6" />
              <div>
                <h3 className="text-xs font-bold uppercase text-foreground">{title}</h3>
                <p className="text-[10px] text-muted/100 sm:text-[11px]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}