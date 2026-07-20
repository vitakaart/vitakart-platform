import { Truck } from "lucide-react";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = 999;
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const remaining = Math.max(0, threshold - subtotal);

  if (subtotal >= threshold) {
    return (
      <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
        <Truck className="w-4 h-4 text-green-600" />
        <span className="text-xs font-bold text-green-700">🎉 Free shipping unlocked!</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-primary-50/50 border border-primary-100 rounded-xl">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-primary-700 font-semibold flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free Shipping</span>
        <span className="text-primary-600 font-bold">₹{remaining.toLocaleString("en-IN")} more</span>
      </div>
      <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}