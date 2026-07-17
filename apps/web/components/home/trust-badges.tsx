// File: apps/web/components/home/trust-badges.tsx
// Premium trust badges with image background

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    tag: "Natural Products",
    title: "Rooted in plant-powered care",
    subtitle: "Weekend discount 20%",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    overlay: "from-purple-900/90 via-purple-800/70 to-purple-600/40",
    btnColor: "text-purple-700",
  },
  {
    tag: "Taste the Best",
    title: "Functional wellness for daily life",
    subtitle: "Weekend discount 10%",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    overlay: "from-[#10B981]/95 via-[#10B981]/70 to-[#10B981]/40",
    btnColor: "text-[#10B981]",
  },
  {
    tag: "Ditch the Junk",
    title: "Upgrade to cleaner ingredients",
    subtitle: "Weekend discount 30%",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=600&q=80",
    overlay: "from-[#F59E0B]/95 via-[#F59E0B]/70 to-[#F59E0B]/40",
    btnColor: "text-[#F59E0B]",
  },
];

export function TrustBadges() {
  return (
    <section>
      {/* Mobile scroll | Desktop grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
        {CARDS.map((card, i) => (
          <Link
            key={i}
            href="#"
            className="group flex-shrink-0 w-[280px] md:w-auto relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 aspect-[16/10]"
          >
            {/* Background Image */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 280px, 33vw"
            />

            {/* Color Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.overlay}`} />

            {/* Content */}
            <div className="relative h-full p-5 flex flex-col justify-between text-white">
              {/* Top */}
              <div>
                <div className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  {card.subtitle}
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-end justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2">
                    {card.title}
                  </h3>
                </div>
                <button className={`w-10 h-10 bg-white ${card.btnColor} rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform shadow-lg`}>
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}