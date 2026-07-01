'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingButton } from '@/components/BookingButton';

/**
 * MainHeader — Sanctuary-themed hero section (Issue #129)
 *
 * Two-column layout on tablet/desktop (content left, arched image right).
 * Stacks to single column on mobile with image on top.
 */
const MainHeader: React.FC = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="py-16 md:py-24 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">

          {/* ── Left column: content ─────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center gap-6 text-center md:text-left">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 justify-center md:justify-start" aria-hidden="true">
              <div className="w-10 h-px bg-clay" />
              <span className="w-1.5 h-1.5 rounded-full bg-clay block" />
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-taupe">
                Kelso · Scottish Borders
              </span>
            </div>

            {/* H1 */}
            <h1
              id="hero-heading"
              className="font-serif text-4xl md:text-[40px] lg:text-[56px] font-medium leading-tight text-espresso mb-0"
            >
              Your sanctuary for{' '}
              <em className="italic text-sage">heavenly</em>
              {' '}treatments
            </h1>

            {/* Lead paragraph */}
            <p className="font-sans text-[17px] text-taupe max-w-[400px] mx-auto md:mx-0 leading-relaxed mb-0">
              Bespoke spa therapies in the heart of Kelso, Scottish Borders.
              Organic, vegan-friendly and deeply relaxing.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <BookingButton
                context="hero"
                className="rounded-full px-8 py-3 h-auto font-sans font-semibold text-sm hover:bg-sage-hover transition-colors"
              >
                Book a treatment
              </BookingButton>
              <Link
                href="/treatments"
                className="font-sans text-sm text-cocoa hover:underline"
              >
                Explore the menu →
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-3 justify-center md:justify-start mt-2">
              <span className="text-sm text-clay" aria-label="Five star rating">★★★★★</span>
              <span className="w-px h-4 bg-clay" aria-hidden="true" />
              <span className="font-sans text-xs text-taupe">
                Organic &amp; vegan friendly
              </span>
            </div>
          </div>

          {/* ── Right column: arched image ───────────────────────────── */}
          <div className="flex-1 flex justify-center w-full">
            <div className="relative w-full max-w-[420px] mx-auto">
              {/* Clay accent ring — desktop/tablet only */}
              <div
                className="absolute inset-0 rounded-t-[260px] border-2 border-clay translate-x-3 translate-y-3 hidden md:block"
                aria-hidden="true"
              />
              {/* Arched image */}
              <div className="relative z-10 w-full aspect-[3/4] rounded-t-[260px] overflow-hidden max-h-[360px] md:max-h-none">
                <Image
                  src="/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.jpg"
                  alt="Young woman receiving a relaxing face massage at Heavenly Treatments spa"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MainHeader;
