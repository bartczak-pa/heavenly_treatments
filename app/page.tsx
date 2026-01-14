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
  generateFAQJsonLd,
  ContactInfo as ContactInfoType
} from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';
import LocationAndBookingSection from '@/components/Sections/LocationAndBooking';
import IntroductionSection from '@/components/Sections/Introduction';
import { getCategories } from '@/lib/cms/treatments';

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Massage & Beauty Treatments in Kelso | Heavenly Treatments Spa';
  const pageDescription = 'Professional massage, facials, and reflexology in Kelso, Scottish Borders. Book your relaxing spa treatment with Hayley today. 5-star experience in a cosy cottage setting.';
  const imageUrl = `${BASE_URL}/images/logo.png`;
  const siteName = 'Heavenly Treatments with Hayleybell';

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: BASE_URL || '/',
    },
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

// Standard spa FAQs for FAQ schema
const homepageFAQs = [
  {
    question: 'How do I book a treatment at Heavenly Treatments?',
    answer: 'You can book a treatment by clicking the "Book Now" button on our website, which will take you to our online booking system. Alternatively, you can contact us directly by phone or email to schedule your appointment.',
  },
  {
    question: 'Where is Heavenly Treatments located?',
    answer: 'Heavenly Treatments is located in Kelso, Scottish Borders. We operate from a private cottage spa setting, providing a peaceful and relaxing environment for your treatments.',
  },
  {
    question: 'What should I expect during my first visit?',
    answer: 'During your first visit, you will have a brief consultation to discuss your needs and any health considerations. You will then be guided to a comfortable treatment room where you can relax and enjoy your chosen therapy.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We kindly request at least 24 hours notice for cancellations or rescheduling. This allows us to offer the appointment to other clients. Late cancellations may be subject to a fee.',
  },
];

async function HomePage() {
  const webSiteJsonLd = generateWebSiteJsonLd();
  // Business schema without aggregateRating (will be added when real review data is integrated)
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);
  const faqJsonLd = generateFAQJsonLd(homepageFAQs);
  const categories = await getCategories();

  // Combine all JSON-LD schemas (server-generated from trusted utility functions)
  const jsonLdContent = JSON.stringify([webSiteJsonLd, businessJsonLd, faqJsonLd]);

  return (
    <MainLayout>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdContent }}
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