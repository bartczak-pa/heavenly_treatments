import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Testimonials from '@/components/sections/testimonials';
import CTASection from '../components/sections/cta';
import MainHeader from '../components/sections/mainHeader';
import ServicesSection from '../components/sections/services';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <MainHeader />

      {/* Services Section */}
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