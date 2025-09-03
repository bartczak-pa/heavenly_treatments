'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { hasConsent } from '@/lib/cookieUtils'; 


declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    // eslint-disable-next-line no-unused-vars
    gtag?: (..._args: any[]) => void; 
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

interface GoogleAnalyticsProps {
  nonce?: string | null;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ nonce }) => {
  const pathname = usePathname();
  const consentGiven = hasConsent(); 

  useEffect(() => {
    if (!consentGiven || !GA_MEASUREMENT_ID) { 
      return;
    }
    
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, consentGiven]); 

  if (!consentGiven || !GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Google Analytics script not loaded due to lack of consent or missing ID.');
    }
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('Loading Google Analytics script...');
  }

  return (
    <>
      <Script 
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        nonce={nonce || undefined}
      />
      <Script 
        id="google-analytics"
        strategy="afterInteractive"
        nonce={nonce || undefined}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics; 