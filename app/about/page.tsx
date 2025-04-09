// app/about/page.tsx
import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Shared/HeroSection';
import MeetTherapist from '@/components/Sections/meetTherapist';
import MyStudio from '@/components/Sections/myStudio';
import ContactInfo from '@/components/Sections/contactInfo';
import CTASection from '../../components/Sections/cta';
export default function AboutPage() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <HeroSection 
          title="About Heavenly Treatments" 
          description="Discover the story behind Heavenly Treatments" 
          imageUrl="/images/spa-about.jpg" 
        />
        
  
        <MeetTherapist />
        <MyStudio />

        <ContactInfo />

        <CTASection 
          title="Ready to experience tranquility?"
          description="Book your appointment today and discover the ultimate escape at our cottage spa in Kelso."
          buttonText="Book Now"
          buttonLink="/contact"
        />
      </div>
    </MainLayout>
  );
}