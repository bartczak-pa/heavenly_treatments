import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import MeetTherapist from '@/components/Sections/meetTherapist';
import MyStudio from '@/components/Sections/myStudio';
import ContactInfo from '@/components/Sections/contactInfo';
import CTASection from '../../components/Sections/cta';
import { Button } from '@/components/ui/button';


export const metadata: Metadata = {
  title: 'About Hayley - Therapist Profile',
  description: 'Learn about Hayley, the qualified therapist behind Heavenly Treatments. Discover her qualifications, philosophy, and the tranquil studio environment.',
};


/**
 * AboutPage Component
 * 
 * @component
 * @description The About page component that displays information about the therapist, Hayley,
 * including her background, philosophy, and the studio environment. The page includes several sections:
 * - A main introduction section
 * - MeetTherapist section
 * - MyStudio section
 * - ContactInfo section
 * - A call-to-action section for booking appointments
 * 
 * @returns {JSX.Element} The rendered About page with all its sections
 * 
 * @example
 * return (
 *   <AboutPage />
 * )
 */

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <main className="flex flex-col">
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
                About Me - Hayley
              </h1>

              <p className="font-sans text-lg text-foreground/90 leading-relaxed">
                Welcome to Heavenly Treatments! I&apos;m Hayley, the founder and therapist behind this space dedicated to your well-being. My passion lies in providing restorative and rejuvenating treatments that help you escape the stresses of daily life and reconnect with yourself.
              </p>
              <p className="font-sans text-lg text-foreground/90 leading-relaxed">
                With years of experience and a deep commitment to holistic care, I specialize in a range of therapies including Massages and Facials. Each session is tailored to your individual needs, ensuring a personalized experience that promotes relaxation, balance, and revitalization.
              </p>
              <p className="font-sans text-lg text-foreground/90 leading-relaxed">
                My treatment room is designed to be a tranquil sanctuary where you can feel comfortable, safe, and completely cared for. I use only high-quality, natural products to nourish your skin and enhance your treatment experience.
              </p>
              <p className="font-sans text-lg text-foreground/90 leading-relaxed">
                I look forward to welcoming you and helping you on your journey to wellness.
              </p>
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="secondary" size="lg">
                <Link href="/treatments">Explore My Treatments</Link>
              </Button>
            </div>
          </div>
        </section>

        <MeetTherapist />
        <MyStudio />
        <ContactInfo />

        <CTASection 
          title="Ready to Relax and Rejuvenate?"
          description="Book your appointment today and start your journey towards wellness."
          buttonText="Book Now"
          buttonLink="/booking"
        />
      </main>
    </MainLayout>
  );
}

export default AboutPage;