import React, { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getTreatmentsByCategory } from '@/lib/cms/treatments';
import { TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
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

  // Fetch categories and validate (using cached version to avoid duplicate calls)
  const categories: TreatmentCategory[] = await getCachedCategories();
  const categoryData = categories.find(cat => cat.slug === categorySlug);

  if (!categoryData) {
    notFound();
  }

  // Fetch treatments for this category
  const treatments = await getTreatmentsByCategory(categorySlug as TreatmentCategorySlug);

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
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-8">
            {categoryData.name} in Kelso
          </h1>

          <div className="flex justify-center mb-2 lg:mb-12">
            <CategoryFilters
              selectedCategory={categorySlug as TreatmentCategorySlug}
              categories={categories}
            />
          </div>

          <div className="text-center mb-6 lg:mb-12">
            <p className="font-sans text-lg text-muted-foreground max-w-xl mx-auto">
              {categoryData.shortDescription || categoryData.description}
            </p>
          </div>

          <FilteredTreatmentsDisplay
            filteredTreatments={treatments}
            currentSelection={categorySlug as TreatmentCategorySlug}
          />
        </div>
      </section>
    </MainLayout>
  );
}
