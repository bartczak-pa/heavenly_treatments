import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import Testimonials from '@/components/Sections/testimonials';
import CTASection from '../components/Sections/cta';
import MainHeader from '../components/Sections/mainHeader';
import ServicesSection from '../components/Sections/services';

export const metadata: Metadata = {
  title: 'Heavenly Treatments with Hayleybell - Wellness & Self-Care',
  description: 'Welcome to Heavenly Treatments in Kelso. Offering professional massage, facial, reflexology, and body treatments to help you relax and rejuvenate.',
};

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
    
    // Optional: Add Twitter specific tags if needed
    // twitter: {
    //   card: 'summary_large_image',
    //   title: pageTitle,
    //   description: pageDescription,
    //   images: [imageUrl], // Must be an absolute URL
    // },
  };
}

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <MainHeader />

      <ServicesSection />

      <Testimonials />

      <CTASection
        title="Ready to Experience Heaven?"
        description="Book your appointment today and start your journey to relaxation and rejuvenation."
        buttonText="Book Now"
        buttonLink="/contact"
      />
    </MainLayout>
  );
};

export default HomePage;