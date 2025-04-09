// app/about/page.tsx
import React from 'react';
import { MainLayout } from '@/app/components/layout/MainLayout';
import HeroSection from '@/app/components/shared/HeroSection';
import MeetTherapist from '@/app/components/sections/meetTherapist';
import MyStudio from '@/app/components/sections/myStudio';
import ContactInfo from '@/app/components/sections/contactInfo';
import CTASection from '../components/sections/cta';
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