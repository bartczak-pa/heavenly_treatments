import React, { ReactNode } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import BookingCtaBand from '@/components/Layout/BookingCtaBand';
import { SpeedInsights } from "@vercel/speed-insights/next"
import CookieConsentWrapper from '@/components/Layout/CookieConsentWrapper';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
      <BookingCtaBand />
      <Footer />
      <CookieConsentWrapper />
      <SpeedInsights />
    </div>
  );
};
