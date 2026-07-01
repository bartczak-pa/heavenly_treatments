'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingButton } from '@/components/BookingButton';

const TrustRowContent: React.FC = () => (
  <>
    <div className="flex flex-col items-start gap-1">
      <span className="text-xl text-sage leading-none" aria-label="Five star rating">★★★★★</span>
      <span className="font-sans text-xs text-taupe">Loved by local clients</span>
    </div>
    <span className="w-px h-8 bg-clay/40" aria-hidden="true" />
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-xs text-taupe">Organic &amp; natural products</span>
      <span className="font-sans text-xs text-taupe">100% vegan &amp; cruelty-free</span>
    </div>
  </>
);

const MainHeader: React.FC = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-8 pb-16 md:pt-12 md:pb-20 lg:py-24 bg-cream overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
          Mobile:  flex-col  → content first, image second, trust row third
          Desktop: flex-row  → left column (content+trust) | right column (image)
        */}
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">

          {/* ── Left column: content ─────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6 text-left">

            {/* Eyebrow */}
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="w-8 h-px bg-clay" />
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-taupe">
                Kelso · Scottish Borders
              </span>
            </div>

            {/* H1 */}
            <h1
              id="hero-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-[68px] xl:text-[76px] font-normal leading-[1.1] text-espresso mb-0"
            >
              Revitalise your mind, body &amp;{' '}
              <em className="italic text-sage">soul.</em>
            </h1>

            {/* Lead paragraph */}
            <p className="font-sans text-base md:text-[17px] text-taupe max-w-[520px] leading-relaxed mb-0">
              A five-star cottage spa experience, hidden in the Scottish
              countryside. Massage, facials &amp; reflexology —
              thoughtfully crafted by Hayley.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <BookingButton
                context="hero"
                className="rounded-full px-8 py-3 h-auto font-sans font-semibold text-sm transition-colors w-full sm:w-auto"
              >
                Book a treatment
              </BookingButton>
              <Link
                href="/treatments"
                className="hidden md:inline-block font-sans text-sm text-cocoa underline underline-offset-2 hover:text-espresso transition-colors"
              >
                Explore the menu →
              </Link>
            </div>

            {/* Trust row — tablet/desktop only (mobile renders after image below) */}
            <div className="hidden md:flex flex-wrap items-center gap-5">
              <TrustRowContent />
            </div>
          </div>

          {/* ── Right column: arched image ───────────────────────────── */}
          <div className="flex-1 flex justify-center relative">

            {/* Decorative circle — tablet/desktop only */}
            <div
              className="absolute top-[-20px] right-[-10px] w-[150px] h-[150px] lg:w-[190px] lg:h-[190px] rounded-full border border-clay/25 hidden md:block"
              aria-hidden="true"
            />

            <div className="relative w-full max-w-[560px] mx-auto">
              <div className="relative w-full aspect-square md:aspect-[4/5] rounded-t-full overflow-hidden border border-clay/20">
                <Image
                  src="/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.jpg"
                  alt="Young woman receiving a relaxing face massage at Heavenly Treatments spa"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Trust row — mobile only, 3rd flex item so it renders after image */}
          <div className="md:hidden flex flex-wrap items-center gap-5">
            <TrustRowContent />
          </div>

        </div>
      </div>
    </section>
  );
};

export default MainHeader;
