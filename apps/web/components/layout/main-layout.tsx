// File: apps/web/components/layout/main-layout.tsx
// Main layout wrapper — with proper mobile spacing

import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { BottomNav } from "./bottom-nav";

interface MainLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideBottomNav?: boolean;
}

export function MainLayout({
  children,
  hideFooter = false,
  hideBottomNav = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white ">
      {/* Navbar */}
      <Navbar />

      {/* Main Content — with bottom padding on mobile for bottom nav */}
      <main className="flex-1 pb-0 md:pb-0 !bg-[var(--main-background)] ">{children}</main>

      {/* Footer — desktop only */}
      {!hideFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}