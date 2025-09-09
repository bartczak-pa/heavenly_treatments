'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { hasConsent } from '@/lib/cookieUtils'; 


declare global {
   
  interface Window {
     
    gtag?: (..._args: any[]) => void; 
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
  googleAdsId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  measurementId, 
  googleAdsId 
}) => {
  const pathname = usePathname();
  const consentGiven = hasConsent(); 

  useEffect(() => {
    if (!consentGiven || !measurementId) { 
      return;
    }
    
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: pathname,
      });
      
      if (googleAdsId) {
        window.gtag('config', googleAdsId, {
          page_path: pathname,
        });
      }
    }
  }, [pathname, consentGiven, measurementId, googleAdsId]); 

  if (!consentGiven || !measurementId) {
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
      {measurementId && (
        <>
          <Script 
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
          <Script 
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${measurementId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
      
      {googleAdsId && (
        <>
          <Script 
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
          />
          <Script 
            id="google-ads-config" 
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');
              `,
            }}
          />
        </>
      )}
    </>
  );
};

export default GoogleAnalytics; 