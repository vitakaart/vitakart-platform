// File: apps/web/components/home/instagram-grid.tsx
// Premium Instagram feed with hover effects

import Image from "next/image";
import { Heart, MessageCircle, } from "lucide-react";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    likes: "2.4k",
    comments: "128",
  },
  {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    likes: "1.8k",
    comments: "94",
  },
  {
    src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
    likes: "3.1k",
    comments: "204",
  },
  {
    src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    likes: "1.2k",
    comments: "67",
  },
  {
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
    likes: "4.5k",
    comments: "312",
  },
  {
    src: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    likes: "2.9k",
    comments: "156",
  },
];

export function InstagramGrid() {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* <Instagram className="w-4 h-4 text-[#10B981]" /> */}
            <div className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
              @vitakart
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">
            Instagram moments
          </h2>
          <p className="text-sm text-[#6B665D] mt-1">
            Lifestyle-led wellness storytelling
          </p>
        </div>
        <a
          href="#"
          className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[#10B981] hover:underline"
        >
          Follow us
          {/* <Instagram className="w-4 h-4" /> */}
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 md:grid-cols-6">
        {IMAGES.map((img, i) => (
          <a
            key={i}
            href="#"
            className="group relative aspect-square overflow-hidden rounded-xl md:rounded-2xl"
          >
            <Image
              src={img.src}
              alt={`Instagram post ${i + 1}`}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 33vw, 16vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 text-white">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold">{img.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold">{img.comments}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}