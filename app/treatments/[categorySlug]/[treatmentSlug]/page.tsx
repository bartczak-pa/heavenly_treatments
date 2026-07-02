import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatmentBySlug, getAllTreatmentSlugs, getCategories, getTreatmentsByCategory, getTreatmentPath } from '@/lib/cms/treatments';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateServiceJsonLd, ContactInfo, generateBreadcrumbJsonLd } from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';
import { TreatmentViewTracker } from '@/components/Analytics/TreatmentViewTracker';
import { AnalyticsErrorBoundary } from '@/components/Analytics/AnalyticsErrorBoundary';
import { TreatmentCategorySlug } from '@/lib/data/treatments';

// Revalidate this page every hour
export const revalidate = 3600;

interface Props {
  params: Promise<{
    categorySlug: string;
    treatmentSlug: string;
  }>;
}

const DEFAULT_WHAT_TO_EXPECT = [
  {
    num: '01',
    title: 'Consultation',
    description: 'We\'ll begin with a brief chat about your needs, health, and what you\'d like to get from today\'s treatment.',
  },
  {
    num: '02',
    title: 'Your treatment',
    description: 'Settle in and relax as your treatment begins, fully tailored to you and your preferences.',
  },
  {
    num: '03',
    title: 'Finishing touches',
    description: 'We\'ll finish with a moment to rest, followed by product recommendations and advice for home care.',
  },
];

export default async function TreatmentDetailPage({ params }: Props) {
  const { treatmentSlug, categorySlug } = await params;

  // Start getCategories immediately (no dependency on treatment) so it runs
  // in parallel with getTreatmentBySlug rather than sequentially after it.
  const categoriesPromise = getCategories();
  const treatment = await getTreatmentBySlug(treatmentSlug);

  if (!treatment) {
    notFound();
  }

  // Resolve categories (already in-flight) and related treatments in parallel.
  const [categories, allCategoryTreatments] = await Promise.all([
    categoriesPromise,
    getTreatmentsByCategory(treatment.category as TreatmentCategorySlug),
  ]);

  const categoryData = categories.find(cat => cat.slug === treatment.category);
  const categoryName = categoryData ? categoryData.name : treatment.category;
  const relatedTreatments = allCategoryTreatments
    .filter(t => t.slug !== treatment.slug)
    .slice(0, 3);

  // --- Prepare Breadcrumb Data ---
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const breadcrumbItems = [
    { name: 'Home', item: BASE_URL },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
    { name: categoryName, item: `${BASE_URL}/treatments/${treatment.category}` },
    { name: treatment.title, item: `${BASE_URL}/treatments/${treatment.category}/${treatment.slug}` },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // --- Prepare Service JSON-LD ---
  const serviceJsonLd = generateServiceJsonLd(treatment, contactInfo as ContactInfo);

  // --- Fallback field resolution (done in component, not in transform) ---
  const resolvedBenefits = (treatment.benefits && treatment.benefits.length > 0)
    ? treatment.benefits
    : (treatment.keyFeatures ?? []);

  const resolvedWhatIsIncluded = (treatment.whatIsIncluded && treatment.whatIsIncluded.length > 0)
    ? treatment.whatIsIncluded
    : (treatment.keyFeatures ?? []);

  const resolvedGoodFor = treatment.goodFor
    ? treatment.goodFor
    : (treatment.description.split('. ')[0] + '.');

  const resolvedWhatToExpect = (treatment.whatToExpect && treatment.whatToExpect.length > 0)
    ? treatment.whatToExpect.map((step, i) => ({
        num: String(i + 1).padStart(2, '0'),
        title: step.title,
        description: step.description,
      }))
    : DEFAULT_WHAT_TO_EXPECT;

  return (
    <MainLayout>
      <Script
        id={`treatment-jsonld-${treatment.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, breadcrumbJsonLd]) }}
      />

      {/* Track treatment view and scroll depth for GA4 analytics */}
      <AnalyticsErrorBoundary componentName="TreatmentViewTracker">
        <TreatmentViewTracker
          treatmentId={treatment.id}
          treatmentName={treatment.title}
          treatmentCategory={categoryName}
          treatmentPrice={treatment.price}
          enableScrollTracking={true}
        />
      </AnalyticsErrorBoundary>

      {/* ── Breadcrumb band ────────────────────────────────────────────── */}
      <div className="border-b bg-stone border-cocoa/10">
        <div className="max-w-[1180px] mx-auto py-4 px-[22px] sm:px-8">
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center font-sans text-[12.5px] text-[#8C8276]">
            <Link href="/" className="font-semibold transition-opacity text-sage hover:opacity-80">
              Home
            </Link>
            <span className="mx-2 text-clay" aria-hidden="true">/</span>
            <Link href="/treatments" className="font-semibold transition-opacity text-sage hover:opacity-80">
              Treatments
            </Link>
            <span className="mx-2 text-clay" aria-hidden="true">/</span>
            <Link
              href={`/treatments/${categorySlug}`}
              className="font-semibold transition-opacity text-sage hover:opacity-80"
            >
              {categoryName}
            </Link>
            <span className="mx-2 text-clay" aria-hidden="true">/</span>
            <span>{treatment.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero section ───────────────────────────────────────────────── */}
      {/* Design spec: padding 56px top, 70px bottom (asymmetric) */}
      <div className="bg-cream pt-[56px] pb-[70px]">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">

          {/* Mobile-only arched image — hidden at md+ where 2-col grid takes over */}
          {treatment.image && (
            <div className="block relative mb-8 md:hidden">
              <div
                className="relative w-full overflow-hidden rounded-[260px_260px_14px_14px] shadow-[0_30px_60px_-30px_rgba(74,64,56,0.45)]"
                style={{ aspectRatio: '4/5', maxHeight: '440px' }}
              >
                <Image
                  src={treatment.image}
                  alt={`${treatment.title} treatment`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          )}

          {/* 2-col grid — activates at md (768px) for tablet and up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
            {/* Left column */}
            <div>
              {/* Eyebrow */}
              <p className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold mb-[18px]">
                {categoryName}
              </p>

              {/* H1 — 34px mobile, 58px tablet+ */}
              <h1 className="font-serif text-[34px] md:text-[58px] font-medium text-[#3A332C] leading-[1.05] tracking-[-0.01em] mb-[14px] md:mb-5">
                {treatment.title}
              </h1>

              {/* Lead — 22px bottom margin on mobile, 28px on tablet+ */}
              <p className="font-sans text-[16px] md:text-[18px] leading-[1.65] text-taupe mb-[22px] md:mb-7 max-w-[460px]">
                {treatment.description}
              </p>

              {/* Duration | Price strip */}
              <div className="border-t border-b border-cocoa/12 py-[18px] md:py-5 mb-6 md:mb-[30px] flex gap-[22px] md:gap-7 items-center">
                <div>
                  <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#8C8276] mb-[5px]">
                    Duration
                  </p>
                  <p className="font-serif text-[24px] text-[#3A332C] font-semibold">
                    {treatment.duration}
                  </p>
                </div>
                <div className="w-px h-[38px] bg-cocoa/[0.14]" aria-hidden="true" />
                <div>
                  <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#8C8276] mb-[5px]">
                    From
                  </p>
                  <p className="font-serif text-[24px] text-sage font-semibold">
                    {treatment.price}
                  </p>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-[22px] flex-wrap">
                <Link
                  href="/contact"
                  className="bg-sage text-warm-white px-[34px] py-4 rounded-full font-sans font-semibold text-[14.5px] hover:bg-sage-hover transition-colors shadow-[0_12px_28px_-12px_rgba(110,126,96,0.7)]"
                >
                  Book this treatment
                </Link>
                <Link
                  href="/treatments"
                  className="font-sans font-semibold text-[14.5px] text-cocoa border-b-[1.5px] border-clay pb-[3px] hover:opacity-80 transition-opacity"
                >
                  ← All treatments
                </Link>
              </div>
            </div>

            {/* Right column: arched image (tablet and up) */}
            {treatment.image && (
              <div className="hidden relative md:block">
                {/* Clay ring decoration */}
                <div
                  className="absolute -top-[18px] -right-[18px] w-[110px] h-[110px] border border-clay rounded-full opacity-50 pointer-events-none"
                  aria-hidden="true"
                />
                {/* Arched hero image — aspect ratio sets row height, left content centres within it */}
                <div
                  className="relative z-10 w-full overflow-hidden rounded-[260px_260px_14px_14px] shadow-[0_30px_60px_-30px_rgba(74,64,56,0.45)]"
                  style={{ aspectRatio: '4/5', maxHeight: '580px' }}
                >
                  <Image
                    src={treatment.image}
                    alt={`${treatment.title} treatment`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body section ───────────────────────────────────────────────── */}
      <div className="bg-stone py-[80px]">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.9fr] gap-[56px] items-start">

            {/* Left: content */}
            <div>
              {/* About this treatment */}
              <h2 className="font-serif text-[36px] font-medium text-[#3A332C] mb-[18px]">
                About this treatment
              </h2>
              <p className="font-sans text-[16.5px] leading-[1.8] text-taupe mb-4">
                {treatment.description}
              </p>

              {/* The benefits */}
              {resolvedBenefits.length > 0 && (
                <div className="mt-[38px]">
                  <h3 className="font-serif text-[28px] font-semibold text-[#3A332C] mb-[18px]">
                    The benefits
                  </h3>
                  <div className="grid grid-cols-1 gap-y-0 gap-x-7 sm:grid-cols-2">
                    {resolvedBenefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex gap-3 items-start py-[10px] border-b border-cocoa/10"
                      >
                        <span className="text-clay text-[15px] shrink-0 mt-[2px]">✦</span>
                        <span className="font-sans text-[15px] leading-normal text-cocoa">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What to expect */}
              <div className="mt-[40px]">
                <h3 className="font-serif text-[28px] font-semibold text-[#3A332C] mb-[22px]">
                  What to expect
                </h3>
                <div className="flex flex-col gap-[18px]">
                  {resolvedWhatToExpect.map((step) => (
                    <div key={step.num} className="flex gap-5 items-start">
                      <span className="font-serif text-[24px] text-sage font-semibold min-w-[36px]">
                        {step.num}
                      </span>
                      <div>
                        <p className="font-serif text-[21px] font-semibold text-[#3A332C] mb-1">
                          {step.title}
                        </p>
                        <p className="font-sans text-[15px] leading-[1.65] text-taupe">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky aside */}
            <aside className="md:sticky md:top-[140px]">
              <div className="bg-warm-white border border-cocoa/10 rounded-[18px] p-8 shadow-[0_24px_50px_-34px_rgba(74,64,56,0.5)]">

                {/* Price + duration header — design: justify-between, labels above each value */}
                <div className="flex items-baseline justify-between pb-[18px] mb-[18px] border-b border-cocoa/12">
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#8C8276] mb-1">From</p>
                    <p className="font-serif text-[30px] text-sage font-semibold">{treatment.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#8C8276] mb-1">Duration</p>
                    <p className="font-serif text-[22px] text-[#3A332C] font-semibold">{treatment.duration}</p>
                  </div>
                </div>

                {/* What's included */}
                {resolvedWhatIsIncluded.length > 0 && (
                  <div className="mb-[22px]">
                    <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-sage font-bold mb-[14px]">
                      What&apos;s included
                    </p>
                    <ul className="flex flex-col gap-[10px]">
                      {resolvedWhatIsIncluded.map((item, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-sage text-[13px] shrink-0 mt-[2px]">✓</span>
                          <span className="font-sans text-[13.5px] leading-normal text-taupe">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Good for */}
                <div className="bg-cream rounded-[12px] px-4 py-[14px] mb-5">
                  <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#8C8276] mb-[5px]">
                    Good for
                  </p>
                  <p className="font-sans text-[14px] leading-[1.55] text-cocoa">
                    {resolvedGoodFor}
                  </p>
                </div>

                {/* Book button — design: padding 15px all sides, font-weight 700 */}
                <Link
                  href="/contact"
                  className="block w-full text-center bg-sage text-warm-white py-[15px] rounded-full font-sans font-bold text-[14.5px] hover:bg-sage-hover transition-colors"
                >
                  Book this treatment
                </Link>

                {/* Phone fallback — design: 13px, #8C8276, mt-14px */}
                <p className="md:hidden font-sans text-[13px] text-[#8C8276] text-center mt-[14px]">
                  or message me on{' '}
                  <a href="tel:07960315337" className="font-semibold transition-opacity text-cocoa hover:opacity-80">
                    07960 315 337
                  </a>
                </p>
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* ── You might also like ────────────────────────────────────────── */}
      {relatedTreatments.length > 0 && (
        <div className="bg-cream py-[80px]">
          <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">
            <h2 className="font-serif text-[38px] font-medium text-[#3A332C] mb-[30px]">
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
              {relatedTreatments.map((related) => (
                <Link
                  key={related.id}
                  href={getTreatmentPath(related)}
                  className="bg-warm-white border border-cocoa/[0.08] rounded-[14px] hover:-translate-y-[5px] hover:shadow-[0_22px_44px_-28px_rgba(74,64,56,0.5)] transition-all duration-300
                    flex items-center justify-between gap-4 p-5
                    md:flex-col md:items-start md:gap-2 md:p-7"
                >
                  {/* Text: category + name + duration (duration hidden on md+ as it moves to bottom row) */}
                  <div className="min-w-0">
                    <p className="font-sans text-[11px] tracking-[0.14em] uppercase text-sage font-semibold mb-[5px]">
                      {categoryName}
                    </p>
                    <p className="font-serif text-[22px] md:text-[25px] font-semibold text-[#3A332C] leading-tight">
                      {related.title}
                    </p>
                    <p className="font-sans text-[11px] tracking-widest uppercase text-[#8C8276] mt-1 md:hidden">
                      {related.duration}
                    </p>
                  </div>

                  {/* Price (mobile: right-aligned) / Duration + Price row (md+) */}
                  <div className="shrink-0 md:w-full md:flex md:justify-between md:items-baseline md:mt-2">
                    <span className="hidden md:block font-sans text-[12.5px] tracking-[0.08em] uppercase text-[#8C8276]">
                      {related.duration}
                    </span>
                    <span className="font-serif text-[20px] text-sage font-semibold">
                      {related.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Closing CTA band ───────────────────────────────────────────── */}
      <div className="bg-sage py-[80px]">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8 text-center">
          <h2 className="font-serif text-[46px] font-medium text-warm-white mb-4 leading-tight">
            Ready to book {treatment.title}?
          </h2>
          <p className="font-sans text-[16.5px] leading-[1.7] text-warm-white/88 max-w-[440px] mx-auto mb-7">
            Appointments Monday to Sunday, 10am&ndash;5pm, with some evenings available. I&apos;ll get back to you with my availability.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block font-sans font-bold text-[14.5px] bg-warm-white text-[#3A332C] px-9 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Contact me &amp; book
            </Link>
            <Link
              href={`/treatments/${categorySlug}`}
              className="inline-block font-sans font-semibold text-[14.5px] border border-warm-white/50 hover:border-warm-white text-warm-white px-8 py-4 rounded-full transition-colors"
            >
              &larr; Back to {categoryName}
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/**
 * TreatmentDetailPage Component
 *
 * @component
 * @description The Treatment Detail page component that displays detailed information about a specific treatment.
 * It shows the treatment's title, description, price, duration, key features, and provides a booking button.
 * The page is dynamically generated based on the treatment slug from the URL parameters.
 *
 * @param {Props} props - The component props
 * @param {Promise<{ [key: string]: string | string[] | undefined }>} props.params - Route parameters containing categorySlug and treatmentSlug
 *
 * @returns {JSX.Element} The rendered Treatment Detail page with all treatment information
 *
 * @example
 * return (
 *   <TreatmentDetailPage params={params} />
 * )
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { treatmentSlug } = await params;
  const treatment = await getTreatmentBySlug(treatmentSlug);

  if (!treatment) {
    return {
      title: "Treatment Not Found",
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const description = treatment.description.substring(0, config.seo.MAX_DESCRIPTION_LENGTH);
  const canonicalUrl = `${BASE_URL}/treatments/${treatment.category}/${treatment.slug}`;

  return {
    title: `${treatment.title} in Kelso | Heavenly Treatments Spa`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${treatment.title} in Kelso | Heavenly Treatments Spa`,
      description: description,
      url: canonicalUrl,
      type: 'article',
      images: treatment.image
        ? [{
            url: `${BASE_URL}${treatment.image}`,
            alt: `Image showing ${treatment.title.toLowerCase()} treatment being performed`,
            width: 800,
            height: 800,
          }]
        : [],
    },
  };
}

export async function generateStaticParams(): Promise<{ categorySlug: string; treatmentSlug: string }[]> {
  const slugs = await getAllTreatmentSlugs();
  return slugs.map((item) => ({
    categorySlug: item.categorySlug,
    treatmentSlug: item.slug,
  }));
}
