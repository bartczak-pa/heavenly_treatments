import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { MainLayout } from '@/components/Layout/MainLayout';
import ContactForm from '@/components/Contact/ContactForm';
import { contactInfo } from '@/lib/data/contactInfo';
import { generateHealthAndBeautyBusinessJsonLd, ContactInfo as ContactInfoType } from '@/lib/jsonLsUtils';
import { getTreatments } from '@/lib/cms/treatments';
import ContactMap from '@/components/Sections/ContactMap';

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Book Massage in Kelso | Contact Heavenly Treatments';
  const pageDescription = 'Book your spa treatment at Heavenly Treatments in Kelso, Scottish Borders. Contact us for massage, facials, reflexology appointments. Easy online booking.';
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

    const treatmentsPromise = getTreatments();
    await params;
    const awaitedSearchParams = await searchParams;

    const initialTreatment = typeof awaitedSearchParams?.treatment === 'string'
        ? awaitedSearchParams.treatment
        : undefined;

    const treatments = await treatmentsPromise;
    const jsonLd = generateHealthAndBeautyBusinessJsonLd(contactInfo as ContactInfoType);

    return (
        <MainLayout>
            <Script
                id="localbusiness-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* A: Hero band */}
            <section className="bg-stone py-14 md:py-[56px]">
                <div className="max-w-[1180px] mx-auto px-4 sm:px-8 text-center">
                    <div className="flex gap-3 justify-center items-center mb-5">
                        <span className="w-7 h-px bg-clay" />
                        <span className="font-sans text-[12px] tracking-[0.22em] uppercase text-sage font-semibold">Get in touch</span>
                        <span className="w-7 h-px bg-clay" />
                    </div>
                    <h1 className="font-serif text-[38px] md:text-[52px] lg:text-[64px] leading-[1.04] font-medium text-espresso mb-[18px] tracking-[-0.01em]">
                        Let&apos;s book your moment of calm
                    </h1>
                    <p className="font-sans text-[15px] md:text-[17px] leading-[1.7] text-taupe max-w-[540px] mx-auto">
                        Send me a message with the treatment you&apos;re after and a few times that suit you. I&apos;ll come back to you with my availability — usually within a day.
                    </p>
                </div>
            </section>

            {/* B: Form + sidebar */}
            <section className="max-w-[1180px] mx-auto px-4 sm:px-8 py-[56px] xl:py-[70px] xl:pb-[90px]">
                <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 xl:gap-12 items-start">

                    {/* Form card */}
                    <div className="bg-warm-white border border-cocoa/10 rounded-[20px] p-6 md:p-8 xl:p-[44px] shadow-[0_24px_50px_-34px_rgba(74,64,56,0.5)]">
                        <h2 className="font-serif text-[32px] font-semibold text-espresso mb-[6px]">Send me a message</h2>
                        <p className="font-sans text-[14.5px] text-[#8C8276] mb-7">Fields marked with ✦ are required.</p>
                        <ContactForm initialTreatment={initialTreatment} treatments={treatments} />
                    </div>

                    {/* Sidebar */}
                    <aside className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-[18px]">

                        {/* Dark info card */}
                        <div className="bg-espresso rounded-[18px] p-[34px]">
                            <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-clay font-bold mb-[22px]">Find me</div>
                            <div className="flex flex-col gap-5">
                                <div className="flex gap-[14px] items-start">
                                    <span className="font-serif text-sage text-[18px] w-5">✦</span>
                                    <div>
                                        <div className="font-sans text-[10.5px] tracking-[0.16em] uppercase text-warm-white/55 mb-[5px]">Address</div>
                                        <a href="https://www.google.com/maps/search/Heavenly+Treatments+with+Hayleybell,+6+Easter+Softlaw+Farm+Cottage,+Kelso+TD5+8BJ" target="_blank" rel="noopener noreferrer" className="font-sans text-[15px] text-warm-white leading-[1.5] hover:text-clay transition-colors">6 Easter Softlaw Farm Cottage,<br />Kelso TD5 8BJ</a>
                                    </div>
                                </div>
                                <div className="h-px bg-warm-white/12" />
                                <div className="flex gap-[14px] items-start">
                                    <span className="font-serif text-sage text-[18px] w-5">✦</span>
                                    <div>
                                        <div className="font-sans text-[10.5px] tracking-[0.16em] uppercase text-warm-white/55 mb-[5px]">Call or message</div>
                                        <a href="tel:07960315337" className="font-sans text-[15px] text-warm-white leading-normal hover:text-clay transition-colors">07960 315 337</a>
                                    </div>
                                </div>
                                <div className="h-px bg-warm-white/12" />
                                <div className="flex gap-[14px] items-start">
                                    <span className="font-serif text-sage text-[18px] w-5">✦</span>
                                    <div>
                                        <div className="font-sans text-[10.5px] tracking-[0.16em] uppercase text-warm-white/55 mb-[5px]">Email</div>
                                        <a href="mailto:hayley@heavenly-treatments.co.uk" className="font-sans text-[15px] text-warm-white leading-normal hover:text-clay transition-colors">hayley@heavenly-treatments.co.uk</a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-[26px]">
                                <a href="https://www.facebook.com/heavenlytreatmentswithhayleybell" target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] text-clay font-semibold hover:text-warm-white transition-colors">Facebook</a>
                                <span className="text-warm-white/30">·</span>
                                <a href="https://www.instagram.com/heavenlytreatments_hayleybell/" target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] text-clay font-semibold hover:text-warm-white transition-colors">Instagram</a>
                            </div>
                        </div>

                        {/* Hours card */}
                        <div className="bg-warm-white border border-cocoa/10 rounded-[18px] p-[34px]">
                            <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-sage font-bold mb-5">Opening hours</div>
                            <div className="flex flex-col gap-[2px]">
                                {[
                                    { day: 'Monday – Friday', hours: '10am – 6pm' },
                                    { day: 'Saturday', hours: '10am – 5pm' },
                                    { day: 'Sunday', hours: 'By appointment' },
                                ].map(({ day, hours }) => (
                                    <div key={day} className="flex justify-between items-baseline py-3 border-b border-cocoa/10">
                                        <span className="font-sans text-[14.5px] text-cocoa font-medium">{day}</span>
                                        <span className="font-serif text-[17px] text-sage font-semibold">{hours}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="font-sans text-[13px] leading-[1.6] text-[#8C8276] mt-4">Free parking right outside the door. Appointments only, so each treatment stays private and unhurried.</p>
                        </div>

                    </aside>
                </div>
            </section>

            {/* C: Map */}
            <ContactMap />

        </MainLayout>
    );
}
