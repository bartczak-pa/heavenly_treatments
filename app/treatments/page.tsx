import React from 'react';
import type { Metadata } from 'next';
import { getTreatments, getCategories, TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import CategoryFilters from '@/components/Treatments/categoryFilters';
import FilteredTreatmentsDisplay from '@/components/Treatments/FilteredTreatmentsDisplay';
import { contactInfo } from '@/lib/data/contactInfo';
import Script from 'next/script';
import { generateHealthAndBeautyBusinessJsonLd, ContactInfo } from '@/lib/jsonLsUtils';

export async function generateMetadata(
  { searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }
): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const siteName = 'Heavenly Treatments with Hayleybell';
  const defaultTitle = 'Treatments Menu | Heavenly Treatments with Hayleybell';
  const defaultDescription = 'Explore my full menu of massage therapies, facials, reflexology, and body treatments. Find the perfect service for your relaxation and wellness needs.';
  const defaultImageUrl = `${BASE_URL}/images/logo.png`;

  let pageTitle = defaultTitle;
  let pageDescription = defaultDescription;
  let ogImageUrl = defaultImageUrl;
  let canonicalUrl = `${BASE_URL}/treatments`;

  const selectedCategorySlug = searchParams?.category as TreatmentCategorySlug | undefined;
  
  if (selectedCategorySlug) {
    const categories = getCategories(); 
    const categoryData = categories.find(cat => cat.slug === selectedCategorySlug);

    if (categoryData) {
      pageTitle = `${categoryData.name} Treatments | ${siteName}`;
      pageDescription = categoryData.description || categoryData.shortDescription || defaultDescription;
      ogImageUrl = categoryData.image ? `${BASE_URL}${categoryData.image}` : defaultImageUrl;
      canonicalUrl = `${BASE_URL}/treatments?category=${selectedCategorySlug}`;
    }
  }

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
          width: 1200,
          height: 630,
          alt: `${pageTitle} Image`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

type Props = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * TreatmentsPage Component
 * 
 * @component
 * @description The Treatments page component that displays a filtered list of available treatments.
 * It supports filtering by treatment category and displays either all treatments or treatments
 * from a specific category based on URL search parameters.
 * 
 * @param {Props} props - The component props
 * @param {Promise<{ [key: string]: string | string[] | undefined }>} props.params - Route parameters
 * @param {Promise<{ [key: string]: string | string[] | undefined }>} [props.searchParams] - URL search parameters
 * 
 * @returns {JSX.Element} The rendered Treatments page with category filters and treatment listings
 * 
 * @example
 * return (
 *   <TreatmentsPage params={params} searchParams={searchParams} />
 * )
 */

export default async function TreatmentsPage(props: Props) { 

  const jsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfo);
    
  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;

  
  // eslint-disable-next-line no-unused-vars
  const _params = awaitedParams; // Assign awaited params to unused variable

  const allTreatments = getTreatments();
  const categories: TreatmentCategory[] = getCategories();

  
  const selectedCategorySlug = awaitedSearchParams?.category as TreatmentCategorySlug | null;
  const currentSelection: TreatmentCategorySlug | 'all' = 
    selectedCategorySlug && categories.some(c => c.slug === selectedCategorySlug) 
      ? selectedCategorySlug 
      : 'all';

  
  const currentCategoryData: TreatmentCategory | null = 
    currentSelection === 'all' 
      ? null 
      : categories.find(cat => cat.slug === currentSelection) || null;

  
  const filteredTreatments = 
    currentSelection === 'all'
      ? allTreatments
      : allTreatments.filter(treatment => treatment.category === currentSelection);

  return (
    <MainLayout>
      <Script 
        id="treatments-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-8">
            {currentCategoryData ? currentCategoryData.name : 'All Treatments'}
          </h1>

          <div className="flex justify-center mb-2 lg:mb-12">
            <CategoryFilters 
              selectedCategory={currentSelection}
            />
          </div>

          {currentCategoryData && (
            <div className="text-center mb-6 lg:mb-12">
              <p className="font-sans text-lg text-muted-foreground max-w-xl mx-auto">
                {currentCategoryData.shortDescription || currentCategoryData.description}
              </p>
            </div>
          )}

          <FilteredTreatmentsDisplay 
            filteredTreatments={filteredTreatments}
            currentSelection={currentSelection}
          />
        </div>
      </section>
    </MainLayout>
  );
}
