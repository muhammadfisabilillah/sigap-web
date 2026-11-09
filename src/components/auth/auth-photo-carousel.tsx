'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Slide = {
  src: string;
  alt: string;
  caption: string;
  position: string;
};

const SLIDES: Slide[] = [
  {
    src: '/images/Surabaya.jpg',
    alt: 'Patung Sura dan Baya, ikon Kota Surabaya',
    caption: 'Patung Sura dan Baya — ikon Kota Surabaya',
    position: 'object-[50%_38%]',
  },
  {
    src: '/images/pexels-pamanjoe-21896936.jpg',
    alt: 'Skyline Kota Surabaya dari udara',
    caption: 'Kota Surabaya dari udara',
    position: 'object-[50%_55%]',
  },
];

const INTERVAL_MS = 5000;

export function AuthPhotoCarousel({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 44vw, 100vw"
            className={`object-cover ${slide.position}`}
          />
        </div>
      ))}

      <div
        className={`absolute z-10 flex items-end justify-between gap-4 ${
          compact
            ? 'bottom-3 left-3 right-3'
            : 'bottom-5 left-5 right-5 sm:bottom-10 sm:left-10 sm:right-10 xl:bottom-12 xl:left-12 xl:right-12'
        }`}
      >
        <p
          className={`bg-black/35 text-white/85 backdrop-blur-sm w-fit ${
            compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-[11px] leading-relaxed'
          }`}
        >
          {SLIDES[index].caption}
        </p>

        {compact ? null : (
          <div className="flex shrink-0 items-center gap-2 pb-1" role="tablist" aria-label="Foto Surabaya">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Foto ${i + 1}: ${slide.caption}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
