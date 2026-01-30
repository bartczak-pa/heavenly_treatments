import React, { ReactNode } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next"
import CookieConsentWrapper from '@/components/Layout/CookieConsentWrapper';
import { getCategories } from '@/lib/cms/treatments';
import { getActivePromotionalOffer } from '@/lib/cms/promotionalOffer';
import { PromotionalDialog } from '@/components/Layout/PromotionalDialog';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = async ({ children }) => {
  const [categories, promotionalOffer] = await Promise.all([
    getCategories(),
    getActivePromotionalOffer(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar categories={categories} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsentWrapper />
      {promotionalOffer && <PromotionalDialog offer={promotionalOffer} />}
      <SpeedInsights />
    </div>
  );
};