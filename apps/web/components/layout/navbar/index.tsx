// File: apps/web/components/layout/navbar/index.tsx
// Remove CategoriesBar import since MegaMenu is now inside DesktopNav

"use client";

import { useState } from "react";
import { AnnouncementBar } from "./announcement-bar";
import { DesktopNav } from "./desktop-nav";
import { MobileHeader } from "./mobile-header";
import { MobileMenu } from "./mobile-menu";
import { MobileSearch } from "./mobile-search";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-md bg-white/95">
        <div className="container-app">
          <MobileHeader
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
            onSearchOpen={() => setIsSearchOpen(true)}
          />
          <DesktopNav />
          {/* CategoriesBar removed - now integrated into DesktopNav as MegaMenu */}
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MobileSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}