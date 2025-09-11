import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MainLayout } from '@/components/Layout/MainLayout';
import MeetTherapist from '@/components/Sections/MeetTherapist';
import { contactInfo } from '@/lib/data/contactInfo';
import Script from 'next/script';
import { generateHealthAndBeautyBusinessJsonLd, ContactInfo as SchemaContactInfo } from '@/lib/jsonLsUtils';

// Loading component for lazy-loaded sections
const SectionSkeleton = () => (
  <div className="py-16 bg-gray-50 animate-pulse" aria-live="polite" aria-busy="true">
    <div className="container mx-auto px-4 max-w-4xl">
      <span className="sr-only">Loading section…</span>
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8" aria-hidden="true"></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          <div className="h-4 bg-gray-200 rounded" aria-hidden="true"></div>
          <div className="h-4 bg-gray-200 rounded" aria-hidden="true"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4" aria-hidden="true"></div>
        </div>
        <div className="lg:w-1/3">
          <div className="h-48 bg-gray-200 rounded" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </div>
);

// Lazy load below-the-fold components via next/dynamic with Suspense wrappers for SSR streaming
const MyStudio = dynamic(() => import('@/components/Sections/MyStudio'));
const ContactInfo = dynamic(() => import('@/components/Sections/ContactInfo'));
const CTASection = dynamic(() => import('@/components/Sections/Cta'));

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Meet Hayley | My Massage & Beauty Journey';
  const pageDescription = 'Learn about Hayley, the qualified therapist behind Heavenly Treatments. Discover her qualifications, philosophy, and the tranquil studio environment.';
  const imageUrl = `${BASE_URL}/images/logo.png`;
  const siteName = 'Heavenly Treatments with Hayleybell';
  const canonicalUrl = `${BASE_URL}/about`;

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
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} About Page Image`,
        },
      ],
      locale: 'en_GB',
      type: 'profile',
    },
  };
}

/**
 * AboutPage Component
 * 
 * @component
 * @description The About page component that displays information about the therapist, Hayley,
 * including her background, philosophy, and the studio environment. The page includes several sections:
 * - A main introduction section
 * - MeetTherapist section
 * - MyStudio section
 * - ContactInfo section
 * - A call-to-action section for booking appointments
 * 
 * @returns {JSX.Element} The rendered About page with all its sections
 * 
 * @example
 * return (
 *   <AboutPage />
 * )
 */

export default function AboutPage() {
  // Generate JSON-LD once per server request
  const jsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as SchemaContactInfo);

  return (
    <MainLayout>
      <Script 
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col">
        <header className="mt-10 mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center">
            Meet Hayley - Your Kelso Massage & Beauty Therapist
          </h1>
        </header> 
        

        <main id="main-content">
          <MeetTherapist />
          
          <Suspense fallback={<SectionSkeleton />}>
            <MyStudio />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <CTASection 
              title="Ready to Relax and Rejuvenate?"
              description="Book your appointment today and start your journey towards wellness."
              buttonText="Book Now"
              buttonLink="/booking"
            />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <ContactInfo />
          </Suspense>
        </main>
        
      </div>
    </MainLayout>
  );
}