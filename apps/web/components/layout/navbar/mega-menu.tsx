// File: apps/web/components/layout/navbar/mega-menu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Leaf, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEGA_MENU_DATA, type MegaMenuCategory } from "@/lib/data/mega-menu";

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MegaMenuCategory>(MEGA_MENU_DATA[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCategoryHover = (category: MegaMenuCategory) => {
    if (category.id !== activeCategory.id) {
      setActiveCategory(category);
    }
  };

  return (
    <div ref={containerRef} className="relative static">
      {/* Catalog Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200",
          isOpen
            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
            : "bg-lime-400 text-slate-900 hover:bg-lime-500 hover:shadow-md"
        )}
      >
        Catalog
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {/* FULL WIDTH Attached Mega Dropdown */}
      {isOpen && (
        <>
          {/* Invisible bridge to prevent mouseleave gap */}
          <div className="absolute top-full left-0 right-0 h-3 bg-transparent z-50" />
          
          {/* Full Width Menu Panel - Attached directly below navbar */}
          <div
            className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white shadow-2xl border-t border-gray-100 animate-slide-in-down z-40"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Container for content alignment */}
            <div className="container-app">
              <div className="grid grid-cols-12 min-h-[420px] py-6">
                
                {/* Left Sidebar - Categories */}
                <div className="col-span-2 lg:col-span-2 border-r border-gray-100 pr-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-3">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {MEGA_MENU_DATA.map((cat) => (
                      <button
                        key={cat.id}
                        onMouseEnter={() => handleCategoryHover(cat)}
                        onClick={() => window.location.href = cat.href}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group",
                          activeCategory.id === cat.id
                            ? "bg-emerald-50 text-emerald-700 shadow-sm"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-semibold text-sm flex-1">{cat.label}</span>
                        <ChevronRight className={cn("w-4 h-4 transition-all", 
                          activeCategory.id === cat.id ? "text-emerald-600 translate-x-0.5" : "text-gray-300 opacity-0 group-hover:opacity-100"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Middle Content - 5 Columns Layout */}
                <div className="col-span-7 lg:col-span-8 px-6 lg:px-8">
                  <div className="grid grid-cols-4 gap-6 lg:gap-8">
                    {/* Column 1: Types */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Type
                      </h4>
                      <ul className="space-y-3">
                        {activeCategory.types.map((item, idx) => (
                          <li key={idx}>
                            <Link
                              href={`${activeCategory.href}?type=${encodeURIComponent(item)}`}
                              className="text-sm text-gray-600 hover:text-emerald-700 hover:underline decoration-emerald-300 underline-offset-4 transition-all block py-0.5"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: Brands */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Top Brands
                      </h4>
                      <ul className="space-y-3">
                        {activeCategory.brands.map((item, idx) => (
                          <li key={idx}>
                            <Link
                              href={`/brands/${encodeURIComponent(item.toLowerCase().replace(/ /g, "-"))}`}
                              className="text-sm text-gray-600 hover:text-emerald-700 hover:underline decoration-emerald-300 underline-offset-4 transition-all block py-0.5"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Health Goals */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Health Goals
                      </h4>
                      <ul className="space-y-3">
                        {activeCategory.healthGoals.map((item, idx) => (
                          <li key={idx}>
                            <Link
                              href={`/health-goals/${encodeURIComponent(item.toLowerCase().replace(/ /g, "-"))}`}
                              className="text-sm text-gray-600 hover:text-emerald-700 hover:underline decoration-emerald-300 underline-offset-4 transition-all block py-0.5"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 4: Featured/Quick Links */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        Trending in {activeCategory.label}
                      </h4>
                      <div className="space-y-2">
                        <Link href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-700 p-2 rounded-lg hover:bg-white transition-all">
                          <span className="text-lg">🔥</span>
                          <span className="font-medium">Best Sellers</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-700 p-2 rounded-lg hover:bg-white transition-all">
                          <span className="text-lg">✨</span>
                          <span className="font-medium">New Arrivals</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-700 p-2 rounded-lg hover:bg-white transition-all">
                          <span className="text-lg">🏷️</span>
                          <span className="font-medium">Deals & Offers</span>
                        </Link>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link
                          href={activeCategory.href}
                          className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 group"
                        >
                          View All {activeCategory.label}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Promo - Attached to right edge */}
                <div className="col-span-3 lg:col-span-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-4">
                        <Leaf className="w-3.5 h-3.5" />
                        Eco-Friendly
                      </span>
                      <h4 className="text-xl font-bold mb-2 leading-tight">Recycle & Earn</h4>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        Exchange empty bottles for store credits. Join 500+ sustainable shoppers.
                      </p>
                    </div>
                    <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Learn More →
                    </button>
                    
                    {/* Decorative */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}