import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/cms/treatments';
import { type TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import TreatmentsAccordion from '@/components/Sections/TreatmentsAccordion';
import { contactInfo } from '@/lib/data/contactInfo';
import Script from 'next/script';
import {
  generateHealthAndBeautyBusinessJsonLd,
  ContactInfo,
  generateBreadcrumbJsonLd
} from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';

// Revalidate this page every hour
export const revalidate = 3600;

const TRUST_CHIPS = ['✦ Organic & natural', '✦ 100% vegan & cruelty-free', '✦ By appointment, Mon–Sun'];

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const siteName = 'Heavenly Treatments with Hayleybell';
  const pageTitle = "Spa Treatments in Kelso | Massage, Facials & Reflexology Menu";
  const pageDescription = "Browse our full menu of massage, facial, and reflexology treatments in Kelso, Scottish Borders. Professional spa services. Book online today.";
  const canonicalUrl = `${BASE_URL}/treatments`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: siteName,
      images: [
        {
          url: `${BASE_URL}/images/logo.png`,
          width: config.seo.DEFAULT_IMAGE.WIDTH,
          height: config.seo.DEFAULT_IMAGE.HEIGHT,
          alt: `${pageTitle} Image`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

/**
 * TreatmentsPage Component
 *
 * Renders an intro band, a hybrid accordion (categories server-side,
 * treatments lazy-loaded per panel via server action), and a closing CTA.
 */
export default async function TreatmentsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Categories are fetched server-side; treatments load lazily per accordion panel
  const categories = (await getCategories()) as TreatmentCategory[];

  // Generate JSON-LD structured data (server-generated, trusted content)
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfo);
  const breadcrumbItems = [
    { name: 'Home', item: BASE_URL || '/' },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // JSON-LD injection — standard Next.js pattern for structured data
  const jsonLdScript = (
    <Script
      id="treatments-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([businessJsonLd, breadcrumbJsonLd]) }}
    />
  );

  return (
    <MainLayout>
      {jsonLdScript}

      {/* ── Intro band ────────────────────────────────────────────────── */}
      <div className="border-b bg-stone border-cocoa/10">
        <div className="max-w-[1180px] mx-auto pt-[30px] pb-7 px-[22px] md:pt-[62px] md:pb-[56px] md:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center mb-[22px] font-sans text-[12.5px]">
            <Link href="/" className="font-semibold transition-opacity text-sage hover:opacity-80">
              Home
            </Link>
            <span className="mx-2 text-clay" aria-hidden="true">/</span>
            <span className="text-[#8C8276]">Treatments</span>
          </nav>

          {/* Eyebrow */}
          <div className="flex items-center gap-[10px] sm:gap-3 mb-[14px] sm:mb-[18px]" aria-hidden="true">
            <span className="w-[22px] sm:w-7 h-px bg-clay shrink-0" />
            <span className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-sage font-semibold">
              The Treatment Menu
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[60px] font-medium text-[#3A332C] tracking-[-0.01em] max-w-[720px] mb-3 sm:mb-5 leading-[1.04]">
            Every treatment, gathered in one calm place
          </h1>

          {/* Lead copy — shorter on mobile, longer on tablet+ */}
          <p className="sm:hidden font-sans text-[14.5px] leading-[1.65] text-taupe max-w-[560px]">
            Tap a category to explore, then tap any treatment for the full details.
          </p>
          <p className="hidden sm:block font-sans text-[16.5px] leading-[1.7] text-taupe max-w-[560px] mb-6">
            Each treatment uses high-quality, primarily organic and natural products — and everything
            I use is vegan and cruelty-free. Browse by category, then tap any treatment for the full
            details.
          </p>

          {/* Trust chips */}
          <div className="hidden sm:flex flex-wrap gap-[14px]">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="font-sans text-[12px] tracking-[0.06em] text-cocoa bg-warm-white border border-cocoa/10 py-2 px-4 rounded-full"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Accordion + CTA card on cream background ─────────────────── */}
      <div className="bg-cream">
        <TreatmentsAccordion categories={categories} />

        {/* "Not sure which to choose?" card — inline, per design */}
        <div className="max-w-[1180px] mx-auto px-[18px] sm:px-8 pt-4 pb-8 sm:pt-0 sm:pb-[90px]">
          <div className="bg-sage rounded-2xl sm:rounded-[20px] py-[30px] px-6 sm:p-[54px] text-center">
            <h2 className="font-serif text-[26px] sm:text-[40px] font-medium text-warm-white mb-[10px] sm:mb-[14px] leading-tight">
              Not sure which to choose?
            </h2>
            <p className="font-sans text-[13.5px] sm:text-[16px] leading-[1.6] sm:leading-[1.7] text-warm-white/88 max-w-[460px] mx-auto mb-5 sm:mb-7">
              Tell me how you&apos;d like to feel and I&apos;ll help you find the perfect treatment.
              Appointments Mon–Sun, 10am–5pm.
            </p>
            <Link
              href="/contact"
              className="inline-block font-sans font-bold text-[13.5px] sm:text-[14.5px] bg-warm-white text-[#3A332C] px-[30px] sm:px-9 py-[14px] sm:py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Contact me &amp; book
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
