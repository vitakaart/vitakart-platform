"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

// ─── Trust Badge Data ────────────────────────────────────────────────
const trustBadges = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over ₹999" },
  { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected" },
  { icon: RotateCcw, label: "Easy Returns", desc: "30-day policy" },
  { icon: CreditCard, label: "COD Available", desc: "Pay on delivery" },
];

// ─── Footer Link Groups ──────────────────────────────────────────────
const shopLinks = [
  { label: "All Products", href: ROUTES.PRODUCTS },
  { label: "Categories", href: ROUTES.CATEGORIES },
  { label: "New Arrivals", href: "#" },
  { label: "Best Sellers", href: "#" },
  { label: "Deals & Offers", href: "#" },
];

const supportLinks = [
  { label: "Contact Us", href: ROUTES.CONTACT },
  { label: "FAQ", href: ROUTES.FAQ },
  { label: "Shipping Info", href: ROUTES.SHIPPING },
  { label: "Returns Policy", href: ROUTES.RETURNS },
  { label: "Track Order", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Press", href: "#" },
  { label: "Affiliates", href: "#" },
];

// ─── Components ──────────────────────────────────────────────────────
function TrustBadge({ icon: Icon, label, desc }: { icon: typeof Truck; label: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-default">
      <div className="w-11 h-11 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center transition-all duration-300 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 group-hover:scale-110 group-hover:rotate-[5deg]">
        <Icon className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-primary-400 group-hover:w-full transition-all duration-300" />
              </span>
              <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-700/50 hover:border-primary-400 hover:-translate-y-[3px] hover:scale-105"
    >
      {children}
    </a>
  );
}

function PaymentIcon({ alt }: { alt: string }) {
  return (
    <div className="h-8 w-12 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700/50 opacity-60 hover:opacity-100 hover:scale-110 hover:-translate-y-0.5 transition-all duration-200">
      <span className="text-[10px] text-gray-400 font-medium">{alt}</span>
    </div>
  );
}

// ─── Main Footer ─────────────────────────────────────────────────────
export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      {/* ─── Trust Badges Bar ─────────────────────────────── */}
      <div className="border-b border-gray-800/60">
        <div className="container-app py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <TrustBadge key={badge.label} {...badge} />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Newsletter Banner ────────────────────────────── */}
      <div className="border-b border-gray-800/60 bg-gray-900/30">
        <div className="container-app py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Join the Wellness Club</h3>
              <p className="text-sm text-gray-400">Get exclusive deals, health tips, and 10% off your first order.</p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-6 py-3 rounded-xl border border-green-400/20 animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">You&apos;re subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-700 focus:border-primary-500 focus:bg-gray-800 outline-none transition-all duration-200 placeholder:text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Footer Content ──────────────────────────── */}
      <div className="container-app py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 mb-5 group">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">Vitakart</span>
                <span className="block text-[10px] text-primary-400 font-medium tracking-[0.2em] uppercase -mt-0.5">Health & Wellness</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-xs">
              Your trusted source for premium health & wellness products. We believe in quality, transparency, and your wellbeing.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-0.5"
              >
                <MapPin className="w-4 h-4 flex-shrink-0 text-primary-400 mt-0.5" />
                <span>123 Health Street, Bangalore, India 560001</span>
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-0.5"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-primary-400" />
                <span>+91 12345 67890</span>
              </a>
              <a
                href="mailto:hello@vitakart.com"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-0.5"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-primary-400" />
                <span>hello@vitakart.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5">
              <SocialLink href="#" label="Facebook">
                <FacebookSvg />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <InstagramSvg />
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <TwitterSvg />
              </SocialLink>
              <SocialLink href="#" label="YouTube">
                <YoutubeSvg />
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <LinkedInSvg />
              </SocialLink>
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-2 sm:col-span-1">
            <FooterLinkGroup title="Shop" links={shopLinks} />
          </div>
          <div className="lg:col-span-2 sm:col-span-1">
            <FooterLinkGroup title="Support" links={supportLinks} />
          </div>
          <div className="lg:col-span-2 sm:col-span-1">
            <FooterLinkGroup title="Company" links={companyLinks} />
          </div>

          {/* App Download */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Download App</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none">Download on the</p>
                  <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none">Get it on</p>
                  <p className="text-sm font-semibold text-white leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ───────────────────────────────────── */}
      <div className="border-t border-gray-800/60 bg-gray-950">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Vitakart. All rights reserved. Made with care in India.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {[
                { label: "Privacy Policy", href: ROUTES.PRIVACY },
                { label: "Terms of Service", href: ROUTES.TERMS },
                { label: "Cookie Policy", href: "#" },
                { label: "Sitemap", href: "#" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-gray-500 hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gray-400 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <PaymentIcon alt="Visa" />
              <PaymentIcon alt="MC" />
              <PaymentIcon alt="Amex" />
              <PaymentIcon alt="UPI" />
              <PaymentIcon alt="COD" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────
function FacebookSvg() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramSvg() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterSvg() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeSvg() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInSvg() {
  return (
    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}