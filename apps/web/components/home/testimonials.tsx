// File: apps/web/components/home/testimonials.tsx
// Premium testimonials with better design

import Image from "next/image";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Aarushi Mehta",
    location: "Bengaluru",
    role: "Wellness Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Beautifully curated platform. The packaging, discovery flow and quick delivery make this feel premium end-to-end.",
    rating: 5,
    bg: "bg-gradient-to-br from-[#10B981]/10 to-[#FEFBF3]",
  },
  {
    name: "Rohan Khanna",
    location: "Mumbai",
    role: "Fitness Coach",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Compact cards, premium look, and genuinely useful product mix. It feels more like a wellness brand than a marketplace.",
    rating: 5,
    bg: "bg-gradient-to-br from-[#F59E0B]/10 to-[#FEFBF3]",
  },
  {
    name: "Ishita Rao",
    location: "Hyderabad",
    role: "Yoga Instructor",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Love the ayurveda selection and the startup-quality polish. Everything feels intentional and easy to browse.",
    rating: 5,
    bg: "bg-gradient-to-br from-purple-500/10 to-[#FEFBF3]",
  },
];

export function Testimonials() {
  return (
    <section className="flex flex-col gap-4">
      {/* Section Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981] mb-1">
          Customer Love
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
          What our community says
        </h2>
      </div>

      {/* Cards — Mobile scroll | Desktop grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
        {REVIEWS.map((review, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-[300px] md:w-auto ${review.bg} rounded-2xl p-5 shadow-sm border border-[#E9E1D2] hover:shadow-md transition-all duration-300 relative overflow-hidden`}
          >
            {/* Quote icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-16 h-16 text-[#0A0A0A]" fill="currentColor" />
            </div>

            {/* Rating */}
            <div className="flex text-[#F59E0B] mb-3 relative">
              {[...Array(review.rating)].map((_, s) => (
                <Star key={s} size={14} fill="currentColor" />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm leading-6 text-[#0A0A0A] mb-4 relative">
              &ldquo;{review.text}&rdquo;
            </p>

            {/* User */}
            <div className="flex items-center gap-3 relative">
              <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-white shadow-md flex-shrink-0">
                <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="44px" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#0A0A0A]">{review.name}</div>
                <div className="text-[10px] text-[#6B665D]">
                  {review.role} • {review.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}