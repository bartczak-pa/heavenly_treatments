import React from 'react';
import type { Metadata } from 'next';
import { getTreatments, getCategories } from '@/lib/cms/treatments';
import { TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import CategoryFilters from '@/components/Treatments/CategoryFilters';
import FilteredTreatmentsDisplay from '@/components/Treatments/FilteredTreatmentsDisplay';
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
 * Displays the complete treatment menu with all available treatments.
 * Category-specific filtering is now handled by /treatments/[categorySlug]/page.tsx
 */
export default async function TreatmentsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Fetch all data
  const categories: TreatmentCategory[] = await getCategories();
  const allTreatments = await getTreatments();

  // Generate JSON-LD structured data (server-generated, trusted content)
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfo);
  const breadcrumbItems = [
    { name: 'Home', item: BASE_URL || '/' },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // JSON-LD injection - standard Next.js pattern for structured data
  // Content is server-generated from trusted utility functions
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
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-8">
            Complete Treatment Spa Menu in Kelso
          </h1>

          <div className="flex justify-center mb-2 lg:mb-12">
            <CategoryFilters
              selectedCategory="all"
              categories={categories}
            />
          </div>

          <FilteredTreatmentsDisplay
            filteredTreatments={allTreatments}
            currentSelection="all"
          />
        </div>
      </section>
    </MainLayout>
  );
}
