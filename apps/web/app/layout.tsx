// File: apps/web/app/layout.tsx
// Root layout with all providers

import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AppProviders } from "@/components/providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Load Inter font from Google
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vitakart — Health & Wellness Store",
    template: "%s | Vitakart",
  },
  description: "Your trusted source for premium health & wellness products",
  keywords: ["health", "wellness", "supplements", "vitamins", "nutrition"],
  authors: [{ name: "Vitakart" }],
  creator: "Vitakart",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vitakart.com",
    title: "Vitakart — Health & Wellness Store",
    description: "Your trusted source for premium health & wellness products",
    siteName: "Vitakart",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
           {/* RAZORPAY SCRIPT */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        {/* All providers wrapper */}
        <AppProviders>
          {children}
        </AppProviders>

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}