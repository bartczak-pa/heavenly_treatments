import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import Testimonials from '@/components/Sections/testimonials';
import CTASection from '../components/Sections/cta';
import MainHeader from '../components/Sections/mainHeader';
import ServicesSection from '../components/Sections/services';

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