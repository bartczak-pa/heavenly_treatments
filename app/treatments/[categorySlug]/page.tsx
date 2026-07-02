import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getTreatmentsByCategory, getTreatmentPath } from '@/lib/cms/treatments';
import { TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
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
  const pageTitle = `${categoryData.name} in Kelso | Heavenly Treatments Spa`;
  const pageDescription = categoryData.description || categoryData.shortDescription ||
    `Professional ${categoryData.name.toLowerCase()} in Kelso, Scottish Borders. Book your session at Heavenly Treatments today.`;
  const canonicalUrl = `${BASE_URL}/treatments/${categorySlug}`;
  const ogImageUrl = categoryData.image ? `${BASE_URL}${categoryData.image}` : `${BASE_URL}/images/logo.png`;

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
  return categories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  // categorySlug is known from params — both fetches are independent, run in parallel.
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

  return (
    <MainLayout>
      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdContent }}
      />

      {/* ── Intro band ────────────────────────────────────────────────── */}
      <div className="bg-stone border-b border-cocoa/10">
        <div className="max-w-[1180px] mx-auto pt-[30px] pb-7 px-[22px] md:pt-[62px] md:pb-[56px] md:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center mb-[22px] font-sans text-[12.5px] text-[#8C8276]">
            <Link href="/" className="text-sage font-semibold hover:opacity-80 transition-opacity">
              Home
            </Link>
            <span className="text-clay mx-2" aria-hidden="true">/</span>
            <Link href="/treatments" className="text-sage font-semibold hover:opacity-80 transition-opacity">
              Treatments
            </Link>
            <span className="text-clay mx-2" aria-hidden="true">/</span>
            <span>{categoryData.name}</span>
          </nav>

          {/* Eyebrow */}
          <div className="flex items-center gap-[10px] sm:gap-3 mb-[14px] sm:mb-[18px]" aria-hidden="true">
            <span className="w-[22px] sm:w-7 h-px bg-clay flex-shrink-0" />
            <span className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-sage font-semibold">
              {categoryData.name}
            </span>
          </div>

          {/* H1 — mobile mb 12px, desktop mb 20px (design spec) */}
          <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[60px] font-medium text-[#3A332C] tracking-[-0.01em] leading-[1.04] max-w-[720px] mb-3 sm:mb-5">
            {categoryData.name}
          </h1>

          {/* Lead — 14.5px mobile, 16.5px desktop */}
          {(categoryData.description || categoryData.shortDescription) && (
            <p className="font-sans text-[14.5px] sm:text-[16.5px] leading-[1.7] text-taupe max-w-[560px] mb-6">
              {categoryData.description || categoryData.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* ── Treatments list + CTA ──────────────────────────────────────── */}
      <div className="bg-cream pt-[70px] pb-[30px]">
        <div className="max-w-[1180px] mx-auto px-[22px] sm:px-8">

          {treatments.length > 0 ? (
            <ul className="mb-[60px]">
              {treatments.map((treatment) => (
                <li key={treatment.id} className="border-t border-cocoa/10 first:border-t-0">
                  <Link
                    href={getTreatmentPath(treatment)}
                    className="flex justify-between items-start gap-6 py-5 px-2 hover:bg-[#F3EEE7] transition-colors rounded-sm"
                  >
                    {/* Left: name, duration, description */}
                    <div className="min-w-0">
                      <p className="font-serif text-[23px] font-semibold text-[#3A332C] mb-[5px] leading-tight">
                        {treatment.title}
                      </p>
                      <p className="font-sans text-[11.5px] tracking-[0.12em] uppercase text-sage font-semibold mb-[9px]">
                        {treatment.duration}
                      </p>
                      <p className="font-sans text-[14px] leading-[1.6] text-taupe max-w-[460px]">
                        {treatment.description}
                      </p>
                    </div>

                    {/* Right: price + link cue */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-serif text-[22px] text-sage font-semibold whitespace-nowrap">
                        {treatment.price}
                      </p>
                      <p className="font-sans text-[12px] font-bold tracking-[0.04em] text-cocoa mt-1">
                        View details &rarr;
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-[16px] text-taupe text-center py-12">
              No treatments found in this category yet.
            </p>
          )}

          {/* "Not sure which to choose?" CTA card */}
          <div className="bg-sage rounded-[20px] p-[54px] text-center mt-4 mb-[90px]">
            <h2 className="font-serif text-[40px] font-medium text-warm-white mb-[14px] leading-tight">
              Not sure which to choose?
            </h2>
            <p className="font-sans text-[16px] leading-[1.7] text-warm-white/88 max-w-[460px] mx-auto mb-7">
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
