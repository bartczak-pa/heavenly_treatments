'use client';

import React from 'react';
import { MainLayout } from '@/app/components/layout/MainLayout';
import HeroSection from '@/app/components/shared/HeroSection';
import ContactInfo, { contactInfo } from '@/app/components/Contact/ContactInfo';
import MapEmbed from '@/app/components/Contact/MapEmbed';
import ContactForm from '@/app/components/Contact/ContactForm';


const ContactPage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection
        title="Get in Touch"
        description="We would love to hear from you! Please fill out the form below to inquire about bookings or ask any questions."
        imageUrl="/images/contact-hero.jpg" //TODO: Ensure this image exists in public/images
      />

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Combined Section for Form and Map/Info */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column: Form */}
          <div className="lg:order-1">
            <h2 className="text-3xl font-bold mb-6 text-primary">Booking Inquiry & Contact Form</h2>
            <ContactForm />
          </div>

          {/* Right Column: Map and Info */}
          <div className="lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Location</h2>
              <MapEmbed src={contactInfo.mapSrc} />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
