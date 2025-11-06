import React from 'react';
import type { Metadata } from 'next';
import { getTreatments, getCategories } from '@/lib/cms/treatments';
import { TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import { 
  DynamicCategoryFilters,
  DynamicFilteredTreatmentsDisplay 
} from '@/components/Dynamic/DynamicComponents';
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

type Props = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const siteName = 'Heavenly Treatments with Hayleybell';
  const defaultTitle = 'My Treatment Menu | Hayleybell\'s Cottage Spa';
  const defaultDescription = 'Explore my full menu of massage therapies, facials, reflexology, and body treatments. Find the perfect service for your relaxation and wellness needs.';
  const defaultImageUrl = `${BASE_URL}/images/logo.png`;

  let pageTitle = defaultTitle;
  let pageDescription = defaultDescription;
  let ogImageUrl = defaultImageUrl;
  let canonicalUrl = `${BASE_URL}/treatments`;

  const selectedCategorySlug = searchParams?.category as TreatmentCategorySlug | undefined;

  if (selectedCategorySlug) {
    const categories = await getCategories();
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
  
  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;
  let BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    if (typeof window !== 'undefined') {
      BASE_URL = window.location.origin;
    } else {
      BASE_URL = process.env.NODE_ENV === 'production' ? 'https://heavenly-treatments.com' : 'http://localhost:3000';
    }
  }
  
  // --- Business JSON-LD ---
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfo);
  // ----------------------
  
  // --- Prepare Breadcrumb Data ---
  const allTreatments = await getTreatments(); // Needed for filtering logic below
  const categories: TreatmentCategory[] = await getCategories(); // Needed for filters and breadcrumb name
  const selectedCategorySlug = awaitedSearchParams?.category as TreatmentCategorySlug | undefined;
  const categoryData = selectedCategorySlug ? categories.find(cat => cat.slug === selectedCategorySlug) : null;
  const categoryName = categoryData ? categoryData.name : null;

  let breadcrumbItems = [
    { name: 'Home', item: BASE_URL },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
  ];

  if (selectedCategorySlug && categoryName) {
    breadcrumbItems.push({ 
      name: categoryName, 
      item: `${BASE_URL}/treatments?category=${selectedCategorySlug}` 
    });
  }
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);
  // -----------------------------
  
  
   
  const _params = awaitedParams; // Assign awaited params to unused variable

  const currentSelection: TreatmentCategorySlug | 'all' = 
    selectedCategorySlug && categoryData 
      ? selectedCategorySlug 
      : 'all';

  const currentCategoryData: TreatmentCategory | null = 
    currentSelection === 'all' 
      ? null 
      : categoryData ?? null; 

  
  const filteredTreatments = 
    currentSelection === 'all'
      ? allTreatments
      : allTreatments.filter(treatment => treatment.category === currentSelection);

  return (
    <MainLayout>
      <Script 
        id="treatments-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([businessJsonLd, breadcrumbJsonLd]) }}
      />
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-8">
            {currentCategoryData 
              ? `Book ${currentCategoryData.name} in Kelso` 
              : 'Complete Treatment Spa Menu in Kelso'}
          </h1>

          <div className="flex justify-center mb-2 lg:mb-12">
            <DynamicCategoryFilters 
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

          <DynamicFilteredTreatmentsDisplay 
            filteredTreatments={filteredTreatments}
            currentSelection={currentSelection}
          />
        </div>
      </section>
    </MainLayout>
  );
}
