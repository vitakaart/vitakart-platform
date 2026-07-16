// File: apps/web/components/layout/navbar/index.tsx
// Main navbar wrapper — combines all pieces

"use client";

import { useState } from "react";
import { AnnouncementBar } from "./announcement-bar";
import { CategoriesBar } from "./categories-bar";
import { DesktopNav } from "./desktop-nav";
import { MobileHeader } from "./mobile-header";
import { MobileMenu } from "./mobile-menu";
import { MobileSearch } from "./mobile-search";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Top Announcement */}
      <AnnouncementBar />

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
        <div className="container-app">
          {/* Mobile Header */}
          <MobileHeader
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
            onSearchOpen={() => setIsSearchOpen(true)}
          />

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Desktop Categories Bar */}
          <CategoriesBar />
        </div>
      </header>

      {/* Mobile Menu (Slide-out) */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Mobile Search (Full-screen) */}
      <MobileSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}