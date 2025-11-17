import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MainLayout } from '@/components/Layout/MainLayout';
import MeetTherapist from '@/components/Sections/MeetTherapist';
import { contactInfo } from '@/lib/data/contactInfo';
import Script from 'next/script';
import {
  generateHealthAndBeautyBusinessJsonLd,
  generatePersonJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd
} from '@/lib/jsonLsUtils';

// Loading component for lazy-loaded sections
const SectionSkeleton = () => (
  <div className="py-16 bg-gray-50 animate-pulse" aria-live="polite" aria-busy="true">
    <div className="container mx-auto px-4 max-w-4xl">
      <span className="sr-only">Loading section…</span>
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8" aria-hidden="true"></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          <div className="h-4 bg-gray-200 rounded" aria-hidden="true"></div>
          <div className="h-4 bg-gray-200 rounded" aria-hidden="true"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4" aria-hidden="true"></div>
        </div>
        <div className="lg:w-1/3">
          <div className="h-48 bg-gray-200 rounded" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </div>
);

// Lazy load below-the-fold components via next/dynamic with Suspense wrappers for SSR streaming
const Qualifications = dynamic(() => import('@/components/Sections/Qualifications'));
const MyStudio = dynamic(() => import('@/components/Sections/MyStudio'));
const Testimonials = dynamic(() => import('@/components/Sections/Testimonials'));
const AboutFAQ = dynamic(() => import('@/components/Sections/AboutFAQ'));
const ContactInfo = dynamic(() => import('@/components/Sections/ContactInfo'));
const CTASection = dynamic(() => import('@/components/Sections/Cta'));

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Meet Hayley Bell | Kelso Massage & Beauty Therapist - 7 Years Experience';
  const pageDescription = 'Meet Hayley Bell - Kelso\'s experienced massage & beauty therapist with 7 years of professional experience. Trained at prestigious Mary Reid Spa Academy, Edinburgh. Formerly at Sheraton One Spa & Schloss. Enjoy 5-star spa treatments in a peaceful cottage setting in the Scottish Borders.';
  const imageUrl = `${BASE_URL}/images/about/owner-of-heavenly-treatments.jpg`;
  const siteName = 'Heavenly Treatments with Hayleybell';
  const canonicalUrl = `${BASE_URL}/about`;

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
          alt: 'Hayley Bell - Qualified Massage and Beauty Therapist in Kelso, Scottish Borders',
        },
      ],
      locale: 'en_GB',
      type: 'profile',
    },
  };
}

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

export default function AboutPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Generate JSON-LD schemas
  const businessJsonLd = generateHealthAndBeautyBusinessJsonLd({
    address: {
      streetAddress: contactInfo.address.streetAddress,
      addressLocality: contactInfo.address.addressLocality,
      postalCode: contactInfo.address.postalCode,
      addressCountry: contactInfo.address.addressCountry
    },
    phone: contactInfo.phone,
    email: contactInfo.email,
    openingHours: contactInfo.openingHours.map(hours => ({
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes
    })),
    mapSrc: contactInfo.mapSrc ?? ''
  });

  const personJsonLd = generatePersonJsonLd();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', item: `${BASE_URL}/` },
    { name: 'About', item: `${BASE_URL}/about` }
  ]);

  const faqJsonLd = generateFAQJsonLd([
    {
      question: "What are your qualifications and experience?",
      answer: "I completed my professional training at the prestigious Mary Reid Spa Academy in Edinburgh in 2017/18, gaining comprehensive qualifications in massage and beauty therapy. Since then, I've worked in exceptional 5-star spa environments including the Sheraton Hotel One Spa and Schloss, bringing over 7 years of professional experience to my practice. I'm fully insured and committed to ongoing professional development."
    },
    {
      question: "Where is the cottage spa located?",
      answer: "My studio is located at 6 Easter Softlaw Farm Cottage, on the peaceful outskirts of Kelso in the Scottish Borders (TD5 8BJ). The rural setting provides a tranquil escape while being just minutes from Kelso town center. Free parking is available right at the cottage."
    },
    {
      question: "What should I expect during my first visit?",
      answer: "When you arrive, you'll be warmly welcomed into a peaceful, private treatment space. We'll start with a brief consultation to understand your needs and any concerns. You'll have access to changing facilities and storage for your belongings. During your treatment, you can relax in a professional therapy room with soothing aromatherapy, gentle music, and premium products."
    },
    {
      question: "What products do you use?",
      answer: "I'm passionate about using only professional-grade products and brands that I trust and believe in. Having worked in 5-star spas, I know the difference that quality products make to your treatment experience and results."
    },
    {
      question: "Is parking available?",
      answer: "Yes! Free, convenient parking is available right at the cottage. There's no need to worry about finding parking or paying for parking meters."
    },
    {
      question: "How do I book an appointment?",
      answer: "You can easily book your appointment online through my Calendly booking system, which shows real-time availability. Alternatively, you can contact me directly via email at hayley@heavenly-treatments.co.uk or call 07960 315 337. I'm open Monday to Sunday, 9 AM – 7 PM."
    }
  ]);

  return (
    <MainLayout>
      {/* Structured Data - Multiple schemas */}
      <Script
        id="business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <Script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="flex flex-col">
        <header className="mt-10 mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center">
            Meet Hayley Bell - Your Kelso Massage & Beauty Therapist
          </h1>
          <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto px-4">
            7 years of professional experience | Trained at Mary Reid Spa Academy | Former Sheraton & Schloss therapist
          </p>
        </header>

        <main id="main-content">
          {/* Hero section - Meet Hayley (above the fold) */}
          <MeetTherapist />

          {/* Qualifications (lazy loaded) */}
          <Suspense fallback={<SectionSkeleton />}>
            <Qualifications />
          </Suspense>

          {/* Studio information */}
          <Suspense fallback={<SectionSkeleton />}>
            <MyStudio />
          </Suspense>

          {/* Testimonials for social proof */}
          <Suspense fallback={<SectionSkeleton />}>
            <Testimonials />
          </Suspense>

          {/* FAQ Section */}
          <Suspense fallback={<SectionSkeleton />}>
            <AboutFAQ />
          </Suspense>

          {/* Contact Information */}
          <Suspense fallback={<SectionSkeleton />}>
            <ContactInfo />
          </Suspense>

          {/* Call to Action */}
          <Suspense fallback={<SectionSkeleton />}>
            <CTASection
              title="Ready to Experience 5-Star Spa Treatments?"
              description="Book your appointment today and discover the ultimate relaxation at my cottage spa in Kelso."
              buttonText="Book Your Treatment"
              buttonLink="/booking"
            />
          </Suspense>
        </main>
      </div>
    </MainLayout>
  );
}