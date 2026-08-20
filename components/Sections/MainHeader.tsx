'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingButton } from '@/components/BookingButton';

const TrustRowContent: React.FC = () => (
  <>
    <div className="flex flex-col gap-1 items-start">
      <span className="text-xl leading-none text-sage" aria-label="Five star rating">★★★★★</span>
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
      className="overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 lg:py-24 bg-cream md:overflow-visible"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/*
          Mobile:  flex-col  → content first, image second, trust row third
          Desktop: flex-row  → left column (content+trust) | right column (image)
        */}
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">

          {/* ── Left column: content ─────────────────────────────────── */}
          <div className="flex-1 md:flex-[1.2] flex flex-col gap-6 text-left">

            {/* Eyebrow */}
            <div className="flex gap-3 items-center" aria-hidden="true">
              <div className="w-8 h-px bg-clay" />
              <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-taupe">
                Kelso · Scottish Borders
              </span>
            </div>

            {/* H1 — keyword-led for local search ("massage kelso") */}
            <h1
              id="hero-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-[60px] xl:text-[68px] font-normal leading-[1.08] text-espresso mb-0"
            >
              Massage, Facials &amp; Reflexology{' '}
              <em className="italic text-sage">in Kelso</em>
            </h1>

            {/* Emotive subhead — brand voice, demoted from H1 */}
            <p className="font-serif italic text-xl md:text-2xl lg:text-[27px] text-taupe leading-snug mb-0 -mt-1">
              Revitalise your mind, body &amp; soul.
            </p>

            {/* Lead paragraph */}
            <p className="font-sans text-base md:text-[17px] text-taupe max-w-[520px] leading-relaxed mb-0">
              A five-star cottage spa experience, hidden in the Scottish countryside &mdash; thoughtfully crafted by Hayley.
            </p>

            {/* CTA row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <BookingButton
                context="hero"
                className="px-8 py-3 w-full h-auto font-sans text-sm font-semibold rounded-full transition-colors sm:w-auto"
              >
                Book a treatment
              </BookingButton>
              <Link
                href="/treatments"
                className="hidden font-sans text-sm underline transition-colors md:inline-block text-cocoa underline-offset-2 hover:text-espresso"
              >
                Explore the menu →
              </Link>
            </div>

            {/* Trust row — tablet/desktop only (mobile renders after image below) */}
            <div className="hidden flex-wrap gap-5 items-center md:flex">
              <TrustRowContent />
            </div>
          </div>

          {/* ── Right column: arched image ───────────────────────────── */}
          <div className="flex-1 md:flex-[0.8] flex justify-center relative md:mr-[24px]">

            {/* Decorative circle — tablet/desktop only */}
            <div
              className="absolute top-[-20px] right-[-10px] w-[150px] h-[150px] lg:w-[190px] lg:h-[190px] rounded-full border border-clay/25 hidden md:block"
              aria-hidden="true"
            />

            <div className="relative w-full max-w-[300px] sm:max-w-[440px] mx-auto">
              <div className="overflow-hidden relative w-full rounded-t-full border aspect-square md:aspect-4/5 border-clay/20">
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
          <div className="flex flex-wrap gap-5 items-center md:hidden">
            <TrustRowContent />
          </div>

        </div>
      </div>
    </section>
  );
};

export default MainHeader;
