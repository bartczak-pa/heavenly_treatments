import React, { ReactNode } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import BookingCtaBand from '@/components/Layout/BookingCtaBand';
import { SpeedInsights } from "@vercel/speed-insights/next"
import CookieConsentWrapper from '@/components/Layout/CookieConsentWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getActivePromotionalOffer } from '@/lib/cms/promotionalOffer';
import { PromotionalDialog } from '@/components/Layout/PromotionalDialog';

interface MainLayoutProps {
  children: ReactNode;
  showCtaBand?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = async ({ children, showCtaBand = false }) => {
  const promotionalOffer = await getActivePromotionalOffer();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
      {showCtaBand && <BookingCtaBand />}
      <Footer />
      <CookieConsentWrapper />
      {promotionalOffer && (
        <ErrorBoundary fallback={null}>
          <PromotionalDialog offer={promotionalOffer} />
        </ErrorBoundary>
      )}
      <SpeedInsights />
    </div>
  );
};
