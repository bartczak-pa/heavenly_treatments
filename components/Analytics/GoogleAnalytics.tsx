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

/**
 * Props interface for the GoogleAnalytics component
 */
interface GoogleAnalyticsProps {
  /** Google Analytics 4 measurement ID (e.g., G-XXXXXXXXXX) */
  measurementId?: string;
  /** Google Ads conversion ID (e.g., AW-XXXXXXXXX) */
  googleAdsId?: string;
}

/**
 * Google Analytics component with consent management and validation
 * 
 * Dynamically loads Google Analytics and Google Ads tracking scripts
 * with proper consent checking and ID validation. Prevents duplicate
 * script loading and XSS risks through ID validation.
 * 
 * @param props - Component props
 * @returns JSX elements for Google Analytics scripts or null if consent not given
 * 
 * @example
 * ```typescript
 * <GoogleAnalytics 
 *   measurementId="G-XXXXXXXXXX"
 *   googleAdsId="AW-XXXXXXXXX"
 * />
 * ```
 */
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

  // Allow Google Ads-only setups by checking for either measurementId or googleAdsId
  if (!consentGiven || (!measurementId && !googleAdsId)) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Google Analytics script not loaded due to lack of consent or missing IDs.');
    }
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('Loading Google Analytics script...');
  }

  // Validate measurement IDs to prevent XSS risks
  const isValidGoogleId = (id: string) => /^G-[A-Z0-9]+$|^AW-[0-9]+$|^DC-[0-9]+$/.test(id);
  
  const validMeasurementId = measurementId && isValidGoogleId(measurementId) ? measurementId : null;
  const validGoogleAdsId = googleAdsId && isValidGoogleId(googleAdsId) ? googleAdsId : null;

  // Load gtag.js once with the primary ID (prefer GA4 over Ads)
  const primaryId = validMeasurementId || validGoogleAdsId;
  if (!primaryId) return null;

  return (
    <>
      <Script 
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      <Script 
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${validMeasurementId ? `gtag('config', '${validMeasurementId}', {
              page_path: window.location.pathname,
            });` : ''}
            ${validGoogleAdsId ? `gtag('config', '${validGoogleAdsId}');` : ''}
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics; 