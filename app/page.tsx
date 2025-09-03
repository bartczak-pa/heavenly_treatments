import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import Testimonials from '@/components/Sections/testimonials';

import MainHeader from '../components/Sections/mainHeader';
import ServicesSection from '../components/Sections/services';
import Script from 'next/script';
import { contactInfo } from '@/lib/data/contactInfo';
import { headers } from 'next/headers';
import { 
  generateWebSiteJsonLd, 
  generateHealthAndBeautyBusinessJsonLd, 
  ContactInfo as ContactInfoType 
} from '@/lib/jsonLsUtils';
import ExperienceSection from '@/components/Sections/Experience';
import LocationAndBookingSection from '@/components/Sections/LocationAndBooking';
import IntroductionSection from '@/components/Sections/Introduction';

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'My Kelso Cottage Spa | Massage & Beauty by Hayleybell'; 
  const pageDescription = 'Discover relaxing massage therapies, facials, and beauty treatments designed to soothe your body and mind. Book your appointment today!';
  const imageUrl = `${BASE_URL}/images/logo.png`; 
  const siteName = 'Heavenly Treatments with Hayleybell';

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: BASE_URL,
      siteName: siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} Logo`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const webSiteJsonLd = generateWebSiteJsonLd();
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);
  const nonce = (await headers()).get('x-nonce');

  return (
    <MainLayout>
      <Script 
        id="homepage-jsonld"
        type="application/ld+json"
        nonce={nonce ?? undefined}
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify([webSiteJsonLd, businessJsonLd])
        }}
      />
      <MainHeader priority={true} />

      <IntroductionSection />
      <ServicesSection showAllButton={false} /> 

     
      <ExperienceSection />
      
      <LocationAndBookingSection />

      <Testimonials />
    </MainLayout>
  );
}