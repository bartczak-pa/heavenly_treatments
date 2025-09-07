import React, { ReactNode } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next"
import CookieConsentWrapper from '@/components/Layout/CookieConsentWrapper';
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsentWrapper />
      <GoogleAnalytics />
      <SpeedInsights />
    </div>
  );
};