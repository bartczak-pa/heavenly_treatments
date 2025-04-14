import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatmentBySlug, getTreatments, getCategories } from '@/lib/data/treatments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, PoundSterling, CheckCircle } from 'lucide-react';
import { Metadata } from 'next';
import Script from 'next/script';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateServiceJsonLd, ContactInfo, generateBreadcrumbJsonLd } from '@/lib/jsonLsUtils';

// eslint-disable-next-line no-unused-vars
type ResolvedParams = {
  categorySlug: string;
  treatmentSlug: string;
};

interface Props {
  params: Promise<{ 
    categorySlug: string; 
    treatmentSlug: string; 
  }>;
}




export default async function TreatmentDetailPage({ params: paramsPromise }: Props) { 
  const params = await paramsPromise;
  const treatment = getTreatmentBySlug(params.treatmentSlug);

  if (!treatment) {
    notFound();
  }

  // Fetch category data for breadcrumb name
  const categories = getCategories();
  const categoryData = categories.find(cat => cat.slug === treatment.category);
  const categoryName = categoryData ? categoryData.name : treatment.category; // Fallback to slug if name not found

  const contactHref = `/contact?treatment=${encodeURIComponent(treatment.title)}`;

  // --- Prepare Breadcrumb Data ---
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const breadcrumbItems = [
    { name: 'Home', item: BASE_URL },
    { name: 'Treatments', item: `${BASE_URL}/treatments` },
    { name: categoryName, item: `${BASE_URL}/treatments?category=${treatment.category}` },
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
              {treatment.image ? (
                <Image
                  src={treatment.image}
                  alt={treatment.title}
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
                {treatment.title}
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
                <Link href={contactHref}>
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Book This Treatment
                  </Button>
                </Link>
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

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const params = await paramsPromise; 
  const treatment = getTreatmentBySlug(params.treatmentSlug);

  if (!treatment) {
    return {
      title: "Treatment Not Found",
    };
  }

  const description = treatment.description.substring(0, 160);

  return {
    title: `${treatment.title}`,
    description: description,
    openGraph: {
      title: `${treatment.title} | Heavenly Treatments`,
      description: description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/treatments/${treatment.category}/${treatment.slug}`,
      type: 'article',
      images: treatment.image
        ? [{ 
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}${treatment.image}`,
            alt: `${treatment.title} - Heavenly Treatments Image`,
            width: 800, 
            height: 800, 
          }]
        : [],
    },
  };
}

export async function generateStaticParams(): Promise<{ categorySlug: string; treatmentSlug: string }[]> {
  const treatments = getTreatments();
  return treatments.map((treatment) => ({
    categorySlug: treatment.category,
    treatmentSlug: treatment.slug,
  }));
}
