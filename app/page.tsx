import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import Testimonials from '@/components/Sections/testimonials';
// import CTASection from '../components/Sections/cta'; // Keep commented out
import MainHeader from '../components/Sections/mainHeader';
import ServicesSection from '../components/Sections/services'; // Uncomment import
import Script from 'next/script';
import { contactInfo } from '@/lib/data/contactInfo';
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
  const pageTitle = 'Heavenly Treatments with Hayleybell - Relax, Rejuvenate, Renew'; 
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

const HomePage: React.FC = () => {
  const webSiteJsonLd = generateWebSiteJsonLd();
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);

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
      <ServicesSection showAllButton={false} /> 

     
      <ExperienceSection />
      
      <LocationAndBookingSection />

      <Testimonials />
    </MainLayout>
  );
};

export default HomePage;