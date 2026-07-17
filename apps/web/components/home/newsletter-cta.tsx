// File: apps/web/components/home/newsletter-cta.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    toast.success("🎉 Subscribed successfully!");
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] px-6 py-8 md:px-8 text-white shadow-md">
      <div className="absolute -left-8 top-0 h-32 w-32 rounded-full bg-[#10B981]/20 blur-3xl" />
      <div className="absolute right-0 top-8 h-24 w-24 rounded-full bg-[#F59E0B]/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Newsletter</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black">
            Get wellness drops, launch alerts, and curated routines in your inbox.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Join the Vitakart circle for exclusive offers, new brand launches, and expert-backed recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="min-h-11 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
          />
          <button
            type="submit"
            className="min-h-11 rounded-2xl bg-[#10B981] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}