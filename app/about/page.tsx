import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { MainLayout } from '@/components/Layout/MainLayout';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateHealthAndBeautyBusinessJsonLd } from '@/lib/jsonLsUtils';
import AboutHero from '@/components/Sections/AboutHero';
import AboutPullQuote from '@/components/Sections/AboutPullQuote';
import AboutStory from '@/components/Sections/AboutStory';
import AboutValues from '@/components/Sections/AboutValues';
import TreatmentRoomSection from '@/components/Sections/TreatmentRoomSection';
import AboutCta from '@/components/Sections/AboutCta';
import Reveal from '@/components/Shared/Reveal';

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'About Hayley | Kelso Massage & Facial Therapist';
  const pageDescription =
    'Meet Hayley, your qualified spa therapist in Kelso, Scottish Borders. Years of 5-star experience, now offering professional massage, facials, and reflexology.';
  const imageUrl = `${BASE_URL}/images/logo.png`;
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
          alt: `${siteName} About Page Image`,
        },
      ],
      locale: 'en_GB',
      type: 'profile',
    },
  };
}

export default function AboutPage() {
  const jsonLd = generateHealthAndBeautyBusinessJsonLd({
    address: {
      streetAddress: contactInfo.address.streetAddress,
      addressLocality: contactInfo.address.addressLocality,
      postalCode: contactInfo.address.postalCode,
      addressCountry: contactInfo.address.addressCountry,
    },
    phone: contactInfo.phone,
    email: contactInfo.email,
    openingHours: contactInfo.openingHours.map((hours) => ({
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    mapSrc: contactInfo.mapSrc ?? '',
  });

  return (
    <MainLayout>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb band */}
      <div className="bg-stone border-b border-cocoa/10 py-3 px-8">
        <div className="max-w-[1180px] mx-auto">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-sans text-[13px]">
              <li>
                <Link href="/" className="font-semibold text-sage hover:text-sage-hover transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-taupe" aria-hidden="true">/</li>
              <li className="text-taupe">About</li>
            </ol>
          </nav>
        </div>
      </div>

      <main id="main-content">
        <AboutHero />
        <Reveal><AboutPullQuote /></Reveal>
        <Reveal><AboutStory /></Reveal>
        <Reveal><AboutValues /></Reveal>
        <div className="hidden md:block">
          <Reveal><TreatmentRoomSection /></Reveal>
        </div>
        <Reveal><AboutCta /></Reveal>
      </main>
    </MainLayout>
  );
}
