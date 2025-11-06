import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  DynamicTestimonials,
  DynamicExperienceSection,
  DynamicServicesSection
} from '@/components/Dynamic/DynamicComponents';

import MainHeader from '@/components/Sections/MainHeader';
import ServicesSection from '@/components/Sections/Services';
import Script from 'next/script';
import { contactInfo } from '@/lib/data/contactInfo';
import {
  generateWebSiteJsonLd,
  generateHealthAndBeautyBusinessJsonLd,
  ContactInfo as ContactInfoType
} from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';
import LocationAndBookingSection from '@/components/Sections/LocationAndBooking';
import IntroductionSection from '@/components/Sections/Introduction';
import { getCategories } from '@/lib/cms/treatments';

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
          width: config.seo.DEFAULT_IMAGE.WIDTH,
          height: config.seo.DEFAULT_IMAGE.HEIGHT,
          alt: `${siteName} Logo`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

async function HomePage() {
  const webSiteJsonLd = generateWebSiteJsonLd();
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);
  const categories = await getCategories();

  return (
    <MainLayout>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webSiteJsonLd, businessJsonLd])
        }}
      />
      <MainHeader />

      <IntroductionSection />
      <ServicesSection categories={categories} showAllButton={false} />


      <DynamicExperienceSection />

      <LocationAndBookingSection />

      <DynamicTestimonials />
    </MainLayout>
  );
}

export default HomePage;