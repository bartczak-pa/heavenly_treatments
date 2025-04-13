

import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { MainLayout } from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Shared/HeroSection';
import ContactInfo from '@/components/Contact/ContactInfo';
import MapEmbed from '@/components/Contact/MapEmbed';
import ContactForm from '@/components/Contact/ContactForm';
import { contactInfo } from '@/lib/data/contactInfo';



export const metadata: Metadata = {
  title: 'Contact & Booking',
  description: 'Contact Heavenly Treatments to book an appointment or ask a question. Find our location, opening hours, and use our contact form.',
};

interface ContactPageProps {
    params: Promise<Record<string, never>>; 
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; 
}


export default async function ContactPage({ params, searchParams }: ContactPageProps) {

    // Await props even if params is unused
    // eslint-disable-next-line no-unused-vars
    const _params = await params; 
    const awaitedSearchParams = await searchParams;
    
    // Extract the treatment title from awaited searchParams
    const initialTreatment = typeof awaitedSearchParams?.treatment === 'string' 
        ? awaitedSearchParams.treatment 
        : undefined;

    // --- Prepare JSON-LD Structured Data for Local Business ---
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HealthAndBeautyBusiness', 
        name: 'Heavenly Treatments with Hayleybell',
        description: metadata.description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/contact`,
        telephone: contactInfo.phone,
        email: contactInfo.email,
        address: contactInfo.address,
        image: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/logo.png`, 

         geo: {
            '@type': 'GeoCoordinates',
            latitude: '55.584',
            longitude: '-2.385',
 
         },
        hasMap: contactInfo.mapSrc, 
    };
    // -------------------------------------------------------

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
