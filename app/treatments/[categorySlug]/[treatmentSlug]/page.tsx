import React from 'react';
import Image from 'next/image';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatmentBySlug, getAllTreatmentSlugs, getCategories } from '@/lib/cms/treatments';
import { notFound } from 'next/navigation';
import { BookingButton } from '@/components/BookingButton';
import { Clock, PoundSterling, CheckCircle } from 'lucide-react';
import { Metadata } from 'next';
import Script from 'next/script';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateServiceJsonLd, ContactInfo, generateBreadcrumbJsonLd } from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';
import { TreatmentViewTracker } from '@/components/Analytics/TreatmentViewTracker';
import { AnalyticsErrorBoundary } from '@/components/Analytics/AnalyticsErrorBoundary';

// Revalidate this page every hour
export const revalidate = 3600;

interface Props {
  params: Promise<{
    categorySlug: string;
    treatmentSlug: string;
  }>;
}




export default async function TreatmentDetailPage({ params }: Props) {
  const { treatmentSlug } = await params;
  const treatment = await getTreatmentBySlug(treatmentSlug);

  if (!treatment) {
    notFound();
  }

  // Fetch category data for breadcrumb name
  const categories = await getCategories();
  const categoryData = categories.find(cat => cat.slug === treatment.category);
  const categoryName = categoryData ? categoryData.name : treatment.category; // Fallback to slug if name not found

  // --- Prepare Breadcrumb Data ---
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const breadcrumbItems = [
    { name: 'Home', item: BASE_URL },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
    { name: categoryName, item: `${BASE_URL}/treatments/${treatment.category}` },
    { name: treatment.title, item: `${BASE_URL}/treatments/${treatment.category}/${treatment.slug}` },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);
  // -----------------------------

  // --- Prepare Service JSON-LD ---
  const serviceJsonLd = generateServiceJsonLd(treatment, contactInfo as ContactInfo);
  // -----------------------------

  return (
    <MainLayout>
      <Script 
        id={`treatment-jsonld-${treatment.slug}`}
        type="application/ld+json"
        // Inject both schemas as an array
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
              {treatment.image ? (
                <Image
                  src={treatment.image}
                  alt={`Image showing ${treatment.title.toLowerCase()} treatment being performed`}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Image coming soon</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary">
                {treatment.title} | Kelso Cottage Spa Treatment
              </h1>
              <p className="font-sans text-lg text-muted-foreground">
                {treatment.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <span className="flex items-center gap-0.5 text-lg font-medium text-primary/90">
                  <PoundSterling className="h-5 w-5" /> 
                  {treatment.price.replace('£', '')}
                </span>
                <span className="flex items-center gap-1.5 text-base">
                  <Clock className="h-4 w-4" /> 
                  {treatment.duration}
                </span>
              </div>

              {treatment.keyFeatures && treatment.keyFeatures.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold text-primary mb-3">Key Features</h2>
                  <ul className="space-y-2">
                    {treatment.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 font-sans text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4">
                <BookingButton
                  context="treatment-detail"
                  treatmentTitle={treatment.title}
                  freshaUrl={treatment.freshaUrl}
                  treatmentId={treatment.id}
                  treatmentCategory={categoryName}
                  treatmentPrice={treatment.price}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  Book This Treatment
                </BookingButton>
              </div>
            </div>
          </div>
        </div>
      </section>
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
    title: `${treatment.title} | My Cottage Spa Treatments`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${treatment.title} | Hayleybell's Cottage Spa`,
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
