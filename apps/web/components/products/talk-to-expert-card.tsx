// File: apps/web/components/products/talk-to-expert-card.tsx
// "Talk to Expert" CTA card in sidebar

import Image from "next/image";

export function TalkToExpertCard() {
  return (
    <div className="rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#10B981] to-[#059669] p-5 text-white shadow-lg">
      {/* Expert image */}
      <div className="relative h-32 w-full mb-4 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80"
          alt="Expert consultation"
          fill
          className="object-cover"
          sizes="300px"
        />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold mb-1">Confused about your regimen?</h3>
      <p className="text-xs text-white/80 mb-4">
        Get a personalized consultation with our certified experts.
      </p>

      <button className="w-full h-11 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white text-sm font-bold transition-all hover:scale-105">
        Talk to an Expert
      </button>
    </div>
  );
}