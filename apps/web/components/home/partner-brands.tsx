// File: apps/web/components/home/partner-brands.tsx
// Premium brand showcase

const BRANDS = [
  { name: "MuscleBlaze", desc: "Sports Nutrition" },
  { name: "Himalaya", desc: "Ayurveda" },
  { name: "Swisse", desc: "Vitamins" },
  { name: "Organic India", desc: "Herbal" },
  { name: "Kapiva", desc: "Wellness" },
  { name: "Kama Ayurveda", desc: "Beauty" },
  { name: "Plix", desc: "Nutrition" },
  { name: "Boldfit", desc: "Fitness" },
];

export function PartnerBrands() {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-1">
          Trusted By
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
          Partner brands
        </h2>
        <p className="text-sm text-[#6B665D] mt-1">
          Trusted names across vitamins, ayurveda and beauty wellness.
        </p>
      </div>

      {/* Brands Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {BRANDS.map((brand, i) => (
          <div
            key={i}
            className="group flex-shrink-0 min-w-[160px] flex flex-col items-center justify-center rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] px-6 py-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#10B981]/50"
          >
            <div className="text-base font-black text-[#0A0A0A] group-hover:text-[#10B981] transition-colors">
              {brand.name}
            </div>
            <div className="text-[10px] text-[#6B665D] mt-1 uppercase tracking-wider">
              {brand.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}