import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { MainLayout } from '@/components/Layout/MainLayout';
import HeroSection from '@/components/Shared/HeroSection';
import ContactInfo from '@/components/Contact/ContactInfo';
import { 
  DynamicContactForm,
  DynamicMapEmbed
} from '@/components/Dynamic/DynamicComponents';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateHealthAndBeautyBusinessJsonLd, ContactInfo as ContactInfoType } from '@/lib/jsonLsUtils';

// Page content constants for better maintainability and i18n support
const PAGE_CONTENT = {
  hero: {
    title: "Book Your Visit at My Kelso Cottage Spa",
    subtitle: "I would love to hear from you! Please fill out the form below to inquire about bookings or ask any questions.",
    imageUrl: "/images/contact/heavenly-treatments-from-outside.jpg"
  },
  sections: {
    contactForm: "Booking Inquiry & Contact Form",
    location: "How to find me"
  },
  metadata: {
    title: 'Book Your Visit | Contact Hayleybell in Kelso',
    description: 'Contact Heavenly Treatments to book an appointment or ask a question. Find our location, opening hours, and use our contact form.',
    siteName: 'Heavenly Treatments with Hayleybell',
    locale: 'en_GB',
    imageWidth: 1200,
    imageHeight: 630
  },
  errors: {
    invalidContactInfo: 'Invalid contact info, skipping JSON-LD generation',
    jsonLdGeneration: 'Failed to generate JSON-LD:',
    pageRender: 'Error rendering contact page:',
    baseUrlMissing: 'NEXT_PUBLIC_BASE_URL not set, using empty string'
  },
  fallback: {
    title: "Contact Us",
    message: "We're experiencing technical difficulties. Please try again later."
  }
} as const;

// Utility functions
function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.warn(PAGE_CONTENT.errors.baseUrlMissing);
  }
  return baseUrl || '';
}

function validateTreatmentParam(param: unknown): string | undefined {
  if (typeof param === 'string' && param.length > 0 && param.length < 100) {
    return param.trim();
  }
  return undefined;
}

function isValidContactInfo(data: unknown): data is ContactInfoType {
  return typeof data === 'object' && data !== null && 
         'businessName' in data && 'email' in data;
}

function safeGenerateJsonLd() {
  try {
    if (!isValidContactInfo(contactInfo)) {
      console.warn(PAGE_CONTENT.errors.invalidContactInfo);
      return null;
    }
    return generateHealthAndBeautyBusinessJsonLd(contactInfo);
  } catch (error) {
    console.error(PAGE_CONTENT.errors.jsonLdGeneration, error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const { title, description, siteName, locale, imageWidth, imageHeight } = PAGE_CONTENT.metadata;
  const canonicalUrl = `${baseUrl}/contact`;
  const imageUrl = `${baseUrl}/images/logo.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      images: [{
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: `${siteName} Contact Page`,
      }],
      locale,
      type: 'website',
    },
  };
}

interface ContactPageProps {
    params: Promise<Record<string, never>>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface ContactPageContentProps {
  initialTreatment?: string;
}

interface ContactFormSectionProps {
  initialTreatment?: string;
}

// Component definitions
function ContactPageContent({ initialTreatment }: ContactPageContentProps) {
  return (
    <section 
      className="py-16 md:py-24 bg-background"
      aria-label="Contact information and booking form"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          <ContactFormSection initialTreatment={initialTreatment} />
          <LocationInfoSection />
        </div>
      </div>
    </section>
  );
}

function ContactFormSection({ initialTreatment }: ContactFormSectionProps) {
  return (
    <div className="lg:order-1" role="main" aria-labelledby="contact-form-heading">
      <h2 
        id="contact-form-heading"
        className="font-serif text-3xl font-semibold mb-6 text-primary"
      >
        {PAGE_CONTENT.sections.contactForm}
      </h2>
      <DynamicContactForm initialTreatment={initialTreatment} />
    </div>
  );
}

function LocationInfoSection() {
  return (
    <aside className="lg:order-2 space-y-8" aria-labelledby="location-info-heading">
      <div>
        <h2 
          id="location-info-heading"
          className="font-serif text-3xl font-semibold mb-6 text-primary"
        >
          {PAGE_CONTENT.sections.location}
        </h2>
        <DynamicMapEmbed />
      </div>
      <ContactInfo />
    </aside>
  );
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {
  try {
    // Params currently unused but required by Next.js
    await params;
    const awaitedSearchParams = await searchParams;
    
    // Validate and sanitize search params
    const initialTreatment = validateTreatmentParam(awaitedSearchParams?.treatment);
    
    // Safe JSON-LD generation with error handling
    const jsonLd = safeGenerateJsonLd();

    return (
      <MainLayout>
        {jsonLd && (
          <Script 
            id="localbusiness-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

        <HeroSection  
          title={PAGE_CONTENT.hero.title}
          subtitle={PAGE_CONTENT.hero.subtitle}
          imageUrl={PAGE_CONTENT.hero.imageUrl}
        />

        <ContactPageContent initialTreatment={initialTreatment} />
      </MainLayout>
    );
  } catch (error) {
    console.error(PAGE_CONTENT.errors.pageRender, error);
    // Fallback to basic layout with error message
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-primary mb-4">{PAGE_CONTENT.fallback.title}</h1>
            <p className="text-muted-foreground">{PAGE_CONTENT.fallback.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
}
