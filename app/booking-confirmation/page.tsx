import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BookingConfirmationTracker } from '@/components/Analytics/BookingConfirmationTracker';
import { AnalyticsErrorBoundary } from '@/components/Analytics/AnalyticsErrorBoundary'; 

export function generateMetadata(): Metadata {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageTitle = 'Booking Request Received | Heavenly Treatments';
  const pageDescription = 'Thank you for requesting an appointment with Heavenly Treatments.';
  const canonicalUrl = `${BASE_URL}/booking-confirmation`;

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
      type: 'website',
    },
    // Prevent search engines from indexing this confirmation page
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default function BookingConfirmationPage() {
  return (
    <MainLayout>
      {/* Track purchase conversion (reads URL params) */}
      <AnalyticsErrorBoundary componentName="BookingConfirmationTracker">
        <Suspense fallback={null}>
          <BookingConfirmationTracker />
        </Suspense>
      </AnalyticsErrorBoundary>

      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your appointment request has been successfully submitted. I will be in touch shortly (usually within 2-3 hours) 
            via your provided contact details to confirm your booking details and time.
          </p>
          <p className="text-md text-gray-600 mb-8">
            If you have any urgent questions, please feel free to call me directly at <a href="tel:07960315337" className="text-primary hover:underline">0796 031 5337</a>.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/treatments">Explore More Treatments</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 