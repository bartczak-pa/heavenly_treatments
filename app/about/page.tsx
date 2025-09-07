import React, { JSX } from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import MeetTherapist from '@/components/Sections/MeetTherapist';
import MyStudio from '@/components/Sections/MyStudio';
import ContactInfo from '@/components/Sections/ContactInfo';
import CTASection from '@/components/Sections/Cta';
import { contactInfo } from '@/lib/data/contactInfo';
import Script from 'next/script';
import { generateHealthAndBeautyBusinessJsonLd, ContactInfo as ContactInfoType } from '@/lib/jsonLsUtils';

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

const AboutPage: React.FC = (): JSX.Element => {
  const jsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);

  return (
    <MainLayout>
      <Script 
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-col">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mt-10 mb-12">
                Meet Hayley - Your Kelso Massage & Beauty Therapist
              </h1> 
        

        <MeetTherapist />
        <MyStudio />
        <CTASection 
          title="Ready to Relax and Rejuvenate?"
          description="Book your appointment today and start your journey towards wellness."
          buttonText="Book Now"
          buttonLink="/booking"
        />
        <ContactInfo />

        
      </main>
    </MainLayout>
  );
}

export default AboutPage;