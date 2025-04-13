'use client';

import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Shared/HeroSection';
import ContactInfo from '@/components/Contact/ContactInfo';
import MapEmbed from '@/components/Contact/MapEmbed';
import ContactForm from '@/components/Contact/ContactForm';


export const metadata: Metadata = {
  title: 'Contact & Booking',
  description: 'Contact Heavenly Treatments to book an appointment or ask a question. Find my location, opening hours, and use my contact form.',
};

interface ContactPageProps {
    params: Promise<Record<string, never>>; 
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; 
}

/**
 * ContactPage Component
 * 
 * @component
 * @description The Contact page component that provides multiple ways for users to get in touch,
 * including a contact form, location map, and contact information. The page supports pre-filling
 * the contact form with a treatment title when accessed from a treatment detail page.
 * 
 * @param {ContactPageProps} props - The component props
 * @param {Promise<Record<string, never>>} props.params - Route parameters (unused)
 * @param {Promise<{ [key: string]: string | string[] | undefined }>} [props.searchParams] - URL search parameters, used to pre-fill treatment in contact form
 * 
 * @returns {JSX.Element} The rendered Contact page with contact form, map, and contact information
 * 
 * @example
 * return (
 *   <ContactPage params={params} searchParams={searchParams} />
 * )
 */

export default async function ContactPage({ params, searchParams }: ContactPageProps) {

    // Await props even if params is unused
    // eslint-disable-next-line no-unused-vars
    const _params = await params; 
    const awaitedSearchParams = await searchParams;
    
    // Extract the treatment title from awaited searchParams
    const initialTreatment = typeof awaitedSearchParams?.treatment === 'string' 
        ? awaitedSearchParams.treatment 
        : undefined;

    return (
        <MainLayout>
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
