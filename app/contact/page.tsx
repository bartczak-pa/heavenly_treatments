import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { MainLayout } from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Shared/HeroSection';
import ContactInfo from '@/components/Contact/ContactInfo';
import MapEmbed from '@/components/Contact/MapEmbed';
import ContactForm from '@/components/Contact/ContactForm';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateHealthAndBeautyBusinessJsonLd, ContactInfo as ContactInfoType } from '@/lib/jsonLsUtils';

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Contact & Booking | Heavenly Treatments with Hayleybell';
  const pageDescription = 'Contact Heavenly Treatments to book an appointment or ask a question. Find our location, opening hours, and use our contact form.';
  const imageUrl = `${BASE_URL}/images/logo.png`;
  const siteName = 'Heavenly Treatments with Hayleybell';
  const canonicalUrl = `${BASE_URL}/contact`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} Contact Page Image`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

interface ContactPageProps {
    params: Promise<Record<string, never>>; 
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; 
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {

    // Await props even if params is unused
    // eslint-disable-next-line no-unused-vars
    const _params = await params; 
    const awaitedSearchParams = await searchParams;
    
    const initialTreatment = typeof awaitedSearchParams?.treatment === 'string' 
        ? awaitedSearchParams.treatment 
        : undefined;


    const jsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);

    return (
        <MainLayout>
            <Script 
                id="localbusiness-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <HeroSection  
                title="Get in Touch"
                subtitle="I would love to hear from you! Please fill out the form below to inquire about bookings or ask any questions."
                imageUrl="/images/contact/heavenly-treatments-from-outside.jpg"
            />

            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
                        <div className="lg:order-1">
                            <h2 className="font-serif text-3xl font-semibold mb-6 text-primary">
                                Booking Inquiry & Contact Form
                            </h2>
                            <ContactForm initialTreatment={initialTreatment} />
                        </div>

                        <div className="lg:order-2 space-y-8">
                            <div>
                                <h2 className="font-serif text-3xl font-semibold mb-6 text-primary">
                                    How to find me
                                </h2>
                                <MapEmbed />
                            </div>
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
