import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { SpeedInsights } from "@vercel/speed-insights/next"
import CookieConsentWrapper from './CookieConsentWrapper';
import GoogleAnalytics from '../Analytics/GoogleAnalytics';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow">{children}</main>
      <Footer />
      <CookieConsentWrapper />
      <GoogleAnalytics />
      <SpeedInsights />
    </div>
  );
};