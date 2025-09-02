'use client';

import { useReportWebVitals } from 'next/web-vitals';

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  entries?: PerformanceEntry[];
}

interface WebVitalsProps {
  /**
   * Enable detailed console logging for debugging
   * @default false
   */
  debug?: boolean;
  
  /**
   * Custom handler for web vitals data
   * @param metric - The web vitals metric data
   */
  // eslint-disable-next-line no-unused-vars
  onMetric?: (metric: WebVitalsMetric) => void;
}

/**
 * Core Web Vitals tracking component using Next.js useReportWebVitals hook
 * 
 * Tracks the following metrics:
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity 
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server responsiveness
 * - INP (Interaction to Next Paint): Interactivity
 */
export function WebVitals({ debug = false, onMetric }: WebVitalsProps) {
  useReportWebVitals((metric: WebVitalsMetric) => {
    // Log metrics in development or when debug is enabled
    if (debug || process.env.NODE_ENV === 'development') {
      console.group(`🚀 Web Vitals - ${metric.name}`);
      console.log('Value:', metric.value);
      console.log('Delta:', metric.delta);
      console.log('Rating:', metric.rating);
      console.log('ID:', metric.id);
      if (metric.entries) {
        console.log('Entries:', metric.entries);
      }
      console.groupEnd();
    }

    // Send to custom analytics if handler provided
    if (onMetric) {
      onMetric(metric);
    }

    // Send to Google Analytics if available - GA4 optimized schema
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vital', {
        metric_name: metric.name,
        metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_rating: metric.rating,
        page_location: window.location.href,
        transport_type: 'beacon',
        non_interaction: true,
      });
    }

    // Send to custom analytics service with reliable transport
    try {
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        const payload = JSON.stringify({
          type: 'web-vitals',
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });

        // Use sendBeacon for reliable unload-time delivery
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
            payload
          );
        } else {
          // Fallback to fetch with keepalive
          fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
            keepalive: true,
          }).catch(() => {
            if (debug) {
              console.warn('Analytics beacon failed, using best-effort delivery');
            }
          });
        }
      }
    } catch (error) {
      if (debug) console.warn('Analytics error:', error);
    }
  });

  // This component doesn't render anything
  return null;
}

/**
 * Hook to manually report custom performance metrics
 */
export function useWebVitals() {
  const reportCustomMetric = (name: string, value: number, unit = 'ms') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_map: {
          metric_unit: unit,
        },
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Custom Metric - ${name}: ${value}${unit}`);
    }
  };

  return { reportCustomMetric };
}