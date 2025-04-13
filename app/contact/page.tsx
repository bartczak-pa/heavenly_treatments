'use client';

import React from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Shared/HeroSection';
import ContactInfo from '@/components/Contact/ContactInfo';
import MapEmbed from '@/components/Contact/MapEmbed';
import ContactForm from '@/components/Contact/ContactForm';

import { contactInfo } from '@/components/Contact/ContactInfo';

// Define props to accept searchParams and params (as Promises for Next.js 15+)
interface ContactPageProps {
    params: Promise<Record<string, never>>; // Wrap params type in Promise
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Wrap searchParams too
}

// Make component async
export default async function ContactPage({ params, searchParams }: ContactPageProps) {
    /* 
    This function is the main contact page.
    It renders the contact page with the contact form and contact info.
    It also extracts the treatment title from the searchParams.

    @param params - The parameters for the contact page
    @param searchParams - The search parameters for the contact page
    @returns A React component that renders the contact page with the contact form and contact info
    @throws Error if the treatment is not found / not valid
    */

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
                                    Our Location
                                </h2>
                                <MapEmbed src={contactInfo.mapSrc} />
                            </div>
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
