import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getCategories,
  getTreatmentsByCategory,
  getTreatmentPath,
} from '@/lib/cms/treatments';
import { TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import { contactInfo } from '@/lib/data/contactInfo';
import Script from 'next/script';
import {
  generateHealthAndBeautyBusinessJsonLd,
  ContactInfo,
  generateBreadcrumbJsonLd,
} from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';

// Revalidate this page every hour
export const revalidate = 3600;

// Cache getCategories to avoid duplicate calls between metadata and component
const getCachedCategories = cache(async () => {
  return await getCategories();
});

interface Props {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const categories = await getCachedCategories();
  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const siteName = 'Heavenly Treatments with Hayleybell';
  const pageTitle = `${categoryData.name} in Kelso | Heavenly Treatments`;
  const pageDescription =
    categoryData.description ||
    categoryData.shortDescription ||
    `Professional ${categoryData.name.toLowerCase()} in Kelso, Scottish Borders. Book your session at Heavenly Treatments today.`;
  const canonicalUrl = `${BASE_URL}/treatments/${categorySlug}`;
  const ogImageUrl = categoryData.image
    ? `${BASE_URL}${categoryData.image}`
    : `${BASE_URL}/images/logo.png`;

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
          url: ogImageUrl,
          width: config.seo.DEFAULT_IMAGE.WIDTH,
          height: config.seo.DEFAULT_IMAGE.HEIGHT,
          alt: `${categoryData.name} Treatments`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

export async function generateStaticParams(): Promise<{ categorySlug: string }[]> {
  const categories = await getCachedCategories();
  return categories.map(category => ({
    categorySlug: category.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  const [categories, treatments] = await Promise.all([
    getCachedCategories() as Promise<TreatmentCategory[]>,
    getTreatmentsByCategory(categorySlug as TreatmentCategorySlug),
  ]);

  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    notFound();
  }

  // Generate JSON-LD structured data (server-generated, trusted content)
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfo);
  const breadcrumbItems = [
    { name: 'Home', item: BASE_URL ? BASE_URL : '/' },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
    { name: categoryData.name, item: `${BASE_URL}/treatments/${categorySlug}` },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // JSON-LD uses dangerouslySetInnerHTML as per Next.js docs for structured data
  // Content is server-generated from trusted functions, not user input
  const jsonLdContent = JSON.stringify([businessJsonLd, breadcrumbJsonLd]);

  // ── Stats computation ────────────────────────────────────────────────────
  const extractNumeric = (str: string): number => {
    const match = /\d+/.exec(str);
    return match ? parseInt(match[0], 10) : 0;
  };

  const prices = treatments.map(t => extractNumeric(t.price)).filter(p => p > 0);
  const priceFrom = prices.length > 0 ? `from £${Math.min(...prices)}` : null;

  const durations = treatments.map(t => extractNumeric(t.duration)).filter(d => d > 0);
  const minDur = durations.length > 0 ? Math.min(...durations) : null;
  const maxDur = durations.length > 0 ? Math.max(...durations) : null;
  const durationRange =
    minDur !== null && maxDur !== null
      ? minDur === maxDur
        ? `${minDur} min`
        : `${minDur}–${maxDur} min`
      : null;

  const otherCategories = categories.filter(cat => cat.slug !== categorySlug);

  return (
    <MainLayout>
      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdContent }}
      />

      {/* ── SECTION 1: Breadcrumb ─────────────────────────────────────────── */}
      <div className="border-b bg-stone border-cocoa/10">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">

          {/* Mobile: back link */}
          <Link
            href="/treatments"
            className="sm:hidden flex items-center gap-2 py-[14px] font-sans text-[12.5px] font-semibold text-sage"
          >
            <span aria-hidden="true">←</span>
            Treatments
          </Link>

          {/* Desktop: full breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center py-[14px] font-sans text-[12.5px] text-[#8C8276]"
          >
            <Link
              href="/"
              className="font-semibold transition-opacity text-sage hover:opacity-80"
            >
              Home
            </Link>
            <span className="mx-2 text-clay" aria-hidden="true">
              /
            </span>
            <Link
              href="/treatments"
              className="font-semibold transition-opacity text-sage hover:opacity-80"
            >
              Treatments
            </Link>
            <span className="mx-2 text-clay" aria-hidden="true">
              /
            </span>
            <span>{categoryData.name}</span>
          </nav>
        </div>
      </div>

      {/* ── SECTION 2: Hero ───────────────────────────────────────────────── */}
      <div className="bg-cream">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-[30px] lg:px-[32px] pt-[32px] sm:pt-[40px] lg:pt-[56px] pb-[40px] sm:pb-[24px] lg:pb-[20px] flex flex-col sm:grid sm:grid-cols-2 sm:items-start sm:gap-[40px] lg:gap-[60px]">

          {/* ── Left: text column ─────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-[10px] sm:gap-3 mb-[14px] sm:mb-[18px]"
              aria-hidden="true"
            >
              <span className="w-[22px] sm:w-7 h-px bg-clay shrink-0" />
              <span className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-sage font-semibold">
                {categoryData.name}
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-serif text-[40px] sm:text-[50px] lg:text-[64px] font-medium text-[#3A332C] tracking-[-0.01em] leading-[1.02] mb-3 sm:mb-5">
              {categoryData.name}
            </h1>

            {/* Intro paragraph */}
            {(categoryData.description || categoryData.shortDescription) && (
              <p className="font-sans text-[15px] sm:text-[17px] leading-[1.75] text-taupe max-w-[480px] mb-[20px] sm:mb-[30px]">
                {categoryData.description || categoryData.shortDescription}
              </p>
            )}

            {/* Stats row */}
            {(priceFrom || durationRange) && (
              <div
                className="flex items-center gap-[14px] sm:gap-6 border-t border-b py-[16px] sm:py-[20px] mb-[24px] sm:mb-[30px]"
                style={{ borderColor: 'rgba(74,64,56,0.12)' }}
              >
                {/* Price */}
                {priceFrom && (
                  <div className="flex flex-col">
                    <span className="font-sans text-[9.5px] sm:text-[11px] uppercase tracking-[0.16em] text-[#8C8276] mb-[3px] sm:mb-[4px]">
                      Price
                    </span>
                    <span className="font-serif text-[17px] sm:text-[19px] lg:text-[23px] text-sage font-semibold">
                      {priceFrom}
                    </span>
                  </div>
                )}

                {/* Duration */}
                {durationRange && (
                  <>
                    {priceFrom && (
                      <div
                        className="w-px h-[32px] sm:h-[38px] shrink-0"
                        style={{ backgroundColor: 'rgba(74,64,56,0.14)' }}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-sans text-[9.5px] sm:text-[11px] uppercase tracking-[0.16em] text-[#8C8276] mb-[3px] sm:mb-[4px]">
                        Duration
                      </span>
                      <span className="font-serif text-[17px] sm:text-[19px] lg:text-[23px] text-[#3A332C] font-semibold">
                        {durationRange}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CTAs — desktop / tablet only (spec: no CTAs in mobile hero) */}
            <div className="hidden gap-6 items-center sm:flex">
              <Link
                href="/contact"
                className="inline-block font-sans font-semibold text-[14.5px] bg-sage text-warm-white px-[34px] py-4 rounded-full hover:opacity-90 transition-opacity"
                style={{ boxShadow: '0 12px 28px -12px rgba(110,126,96,0.7)' }}
              >
                Book a session
              </Link>
              <Link
                href="/treatments"
                className="font-sans font-semibold text-[14.5px] text-[#4A4038] border-b-[1.5px] border-clay pb-[3px] hover:opacity-80 transition-opacity"
              >
                All treatments &rarr;
              </Link>
            </div>
          </div>

          {/* ── Right: image column ───────────────────────────────────────── */}
          <div className="relative mt-[24px] sm:mt-0">
            {/* Decorative circle — tablet / desktop only */}
            <div className="hidden sm:block absolute -top-[18px] -right-[18px] sm:w-[90px] sm:h-[90px] lg:w-[110px] lg:h-[110px] border border-clay rounded-full opacity-50 z-2" />

            {/* Image container with pill-top border-radius */}
            <div
              className="relative z-1 w-full overflow-hidden h-[240px] sm:h-[380px] lg:h-[520px] rounded-t-[140px] rounded-b-[14px] sm:rounded-t-[190px] sm:rounded-b-[12px] lg:rounded-t-[240px] lg:rounded-b-[14px]"
              style={{ boxShadow: '0 30px 60px -30px rgba(74,64,56,0.45)' }}
            >
              {categoryData.image ? (
                <Image
                  src={categoryData.image}
                  alt={`${categoryData.name} treatments`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-stone" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Treatment list ─────────────────────────────────────── */}
      <div className="bg-cream pt-[50px] sm:pt-[60px] pb-[40px] sm:pb-[50px]">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">

          {/* Heading row */}
          <div className="mb-[20px] sm:mb-[24px]">
            <h2 className="font-serif text-[28px] sm:text-[34px] font-medium text-[#3A332C]">
              The {categoryData.name} menu
            </h2>
          </div>

          {/* Mobile: individual cards */}
          <div className="sm:hidden flex flex-col gap-[10px] mb-[40px]">
            {treatments.length > 0 ? (
              treatments.map(treatment => (
                <Link
                  key={treatment.id}
                  href={getTreatmentPath(treatment)}
                  className="block bg-[#FAF6F0] border border-cocoa/8 rounded-2xl p-[18px_20px] hover:bg-cream transition-colors"
                >
                  <div className="flex justify-between items-start mb-[6px]">
                    <h3 className="font-serif text-[19px] font-semibold text-[#3A332C] leading-tight mr-3">
                      {treatment.title}
                    </h3>
                    <span className="font-serif text-[19px] text-sage font-semibold whitespace-nowrap shrink-0">
                      {treatment.price}
                    </span>
                  </div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-sage font-semibold mb-[6px]">
                    {treatment.duration}
                  </p>
                  <p className="font-sans text-[13px] leading-[1.6] text-taupe">
                    {treatment.description}
                  </p>
                </Link>
              ))
            ) : (
              <p className="font-sans text-[16px] text-taupe text-center py-12">
                No treatments found in this category yet.
              </p>
            )}
          </div>

          {/* Tablet + Desktop: unified list container */}
          {treatments.length > 0 ? (
            <div className="hidden sm:block bg-[#FAF6F0] border border-cocoa/8 rounded-2xl px-7 pb-3 pt-[6px] mb-[50px] sm:mb-[60px]">
              {treatments.map(treatment => (
                <Link
                  key={treatment.id}
                  href={getTreatmentPath(treatment)}
                  className="flex justify-between items-start gap-6 py-[22px] px-2 border-t border-cocoa/10 first:border-t-0 hover:bg-cream transition-colors rounded-sm"
                >
                  {/* Left: name, duration, description */}
                  <div className="min-w-0">
                    <h3 className="font-serif text-[21px] lg:text-[23px] font-semibold text-[#3A332C] mb-[5px] leading-tight">
                      {treatment.title}
                    </h3>
                    <p className="font-sans text-[11.5px] uppercase tracking-[0.12em] text-sage font-semibold mb-[9px]">
                      {treatment.duration}
                    </p>
                    <p className="font-sans text-[14px] leading-[1.6] text-taupe max-w-[440px] lg:max-w-[520px]">
                      {treatment.description}
                    </p>
                  </div>

                  {/* Right: price + link cue */}
                  <div className="text-right shrink-0">
                    <p className="font-serif text-[22px] text-sage font-semibold whitespace-nowrap">
                      {treatment.price}
                    </p>
                    <p className="font-sans text-[12px] font-bold tracking-[0.04em] text-cocoa mt-1">
                      View details &rarr;
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="hidden sm:block font-sans text-[16px] text-taupe text-center py-12 mb-[50px]">
              No treatments found in this category yet.
            </p>
          )}
        </div>
      </div>

      {/* ── SECTION 4: Explore other collections ─────────────────────────── */}
      {otherCategories.length > 0 && (
        <div className="bg-stone py-[50px] sm:py-[60px]">
          <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-[24px] sm:mb-[30px]">
              <span className="w-7 h-px bg-clay shrink-0" />
              <span className="font-sans text-[12px] uppercase text-sage font-semibold tracking-[0.22em]">
                Explore other collections
              </span>
            </div>

            {/* Mobile: simple vertical stack */}
            <div className="sm:hidden flex flex-col gap-[10px]">
              {otherCategories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/treatments/${cat.slug}`}
                  className="flex items-center gap-[14px] bg-[#FAF6F0] border border-cocoa/8 rounded-2xl p-[16px_20px] hover:bg-cream transition-colors"
                >
                  <p className="font-serif text-[21px] font-semibold text-[#3A332C] leading-tight flex-1 min-w-0">
                    {cat.name}
                  </p>
                  <span className="font-sans font-bold text-sage text-[13px] tracking-[0.02em] shrink-0">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>

            {/* Tablet + Desktop: 2-col → 4-col grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-[14px] lg:gap-[18px]">
              {otherCategories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/treatments/${cat.slug}`}
                  className="bg-[#FAF6F0] border border-cocoa/8 rounded-2xl p-[26px] flex flex-col gap-[10px] hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <h3 className="font-serif sm:text-[21px] lg:text-[25px] font-semibold text-[#3A332C] leading-tight">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-[13.5px] leading-[1.6] text-taupe flex-1">
                    {cat.shortDescription || cat.description}
                  </p>
                  <p className="font-sans font-bold text-sage text-[13px] tracking-[0.02em]">
                    Discover &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 5: Green CTA block ───────────────────────────────────── */}
      <div className="bg-cream py-[60px] sm:py-[80px] sm:pb-[90px]">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">
          <div className="bg-sage rounded-[20px] p-[40px_22px] sm:p-[54px] text-center">
            <h2 className="font-serif text-[28px] sm:text-[40px] font-medium text-warm-white mb-[14px] leading-tight">
              Not sure which to choose?
            </h2>
            <p className="font-sans text-[13.5px] sm:text-[16px] leading-[1.7] text-warm-white/88 max-w-[470px] mx-auto mb-7">
              Tell me how you&apos;d like to feel and I&apos;ll help you find the perfect treatment.
              Appointments Mon&ndash;Sun, 10am&ndash;5pm.
            </p>
            <Link
              href="/contact"
              className="inline-block font-sans font-bold text-[14.5px] bg-warm-white text-[#3A332C] px-9 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Contact me &amp; book
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
