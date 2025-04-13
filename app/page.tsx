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