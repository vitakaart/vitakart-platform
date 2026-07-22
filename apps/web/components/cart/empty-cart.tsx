import Link from "next/link";
import { ShoppingCart, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/lib/constants/routes";

interface EmptyCartProps {
  onClose?: () => void;
}

export function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-scale-in">
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border-2 border-primary-200">
          <ShoppingCart className="w-14 h-14 text-primary-400" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center border-2 border-white">
          <Sparkles className="w-4 h-4 text-accent-500" />
        </div>
        {/* Decorative dots */}
        <div className="absolute -bottom-2 -left-3 w-4 h-4 rounded-full bg-primary-200/60" />
        <div className="absolute top-4 -left-6 w-3 h-3 rounded-full bg-accent-200/60" />
      </div>

      {/* Text */}
      <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">
        Your cart is empty
      </h3>
      <p className="text-sm text-[#6B665D] mb-2 max-w-xs leading-relaxed">
        Looks like you haven&apos;t added anything to your cart yet. Discover our wellness products!
      </p>

      {/* Suggested Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 mt-4">
        {["Vitamins", "Supplements", "Protein", "Wellness"].map((cat) => (
          <Link
            key={cat}
            href={`${ROUTES.PRODUCTS}?category=${cat.toLowerCase()}`}
            className="px-3 py-1.5 bg-[#F5F1E8] hover:bg-primary-50 text-[#6B665D] hover:text-primary-700 text-xs font-semibold rounded-full transition-all duration-200 hover:shadow-sm"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Primary CTA */}
           <Link href={ROUTES.PRODUCTS}>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white h-11">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </Link>

      {/* Secondary Link */}
      <Link
        href={ROUTES.HOME}
        className="mt-4 text-sm text-[#6B665D] hover:text-primary-600 font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}