// File: apps/web/components/home/deal-banner.tsx
// Premium deal cards — Image as background + button next to timer

import Image from "next/image";

const DEALS = [
  {
    tag: "Flash Sale",
    title: "Beauty & wellness reset",
    desc: "Premium care bundles ending tonight.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    overlayColor: "from-[#DC2626]/95 via-[#DC2626]/70 to-[#DC2626]/40",
    btnBg: "bg-white",
    btnText: "text-[#DC2626]",
    timer: [{ v: "02", l: "Days" }, { v: "14", l: "Hrs" }, { v: "48", l: "Min" }, { v: "22", l: "Sec" }],
  },
  {
    tag: "Happy Hour",
    title: "Protein picks at startup speed",
    desc: "Fast-moving sports nutrition deals.",
    image: "https://images.unsplash.com/photo-1594737625785-cf1941db2a82?auto=format&fit=crop&w=800&q=80",
    overlayColor: "from-[#F59E0B]/95 via-[#F59E0B]/70 to-[#F59E0B]/40",
    btnBg: "bg-white",
    btnText: "text-[#F59E0B]",
    timer: [{ v: "01", l: "Days" }, { v: "08", l: "Hrs" }, { v: "16", l: "Min" }, { v: "09", l: "Sec" }],
  },
];

export function DealBanner() {
  return (
    <section>
      {/* Mobile: Horizontal scroll | Desktop: Grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-2 md:gap-4 md:overflow-visible">
        {DEALS.map((deal, i) => (
          <div
            key={i}
            className="group flex-shrink-0 w-[300px] md:w-auto relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 aspect-[16/9] md:aspect-[16/9]"
          >
            {/* Background Image */}
            <Image
              src={deal.image}
              alt={deal.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 300px, 50vw"
            />

            {/* Color Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${deal.overlayColor}`} />

            {/* Content */}
            <div className="relative h-full p-4 md:p-5 flex flex-col justify-between text-white">
              {/* Top — Tag & Title */}
              <div>
                <div className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  {deal.tag}
                </div>
                <h3 className="mt-2 text-base md:text-xl font-bold line-clamp-1">
                  {deal.title}
                </h3>
                <p className="mt-1 text-xs text-white/90 line-clamp-1">{deal.desc}</p>
              </div>

              {/* Bottom — Timer + Button */}
              <div className="flex items-end justify-between gap-3">
                {/* Timer */}
                <div className="grid grid-cols-4 gap-1 flex-1 max-w-[200px]">
                  {deal.timer.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-white/20 backdrop-blur-md px-1.5 py-1 text-center"
                    >
                      <div className="text-sm md:text-base font-black leading-tight">{t.v}</div>
                      <div className="text-[8px] md:text-[9px] text-white/80">{t.l}</div>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  className={`h-9 md:h-10 rounded-full ${deal.btnBg} ${deal.btnText} px-4 text-xs font-bold shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap flex-shrink-0`}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}