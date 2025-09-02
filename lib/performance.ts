/**
 * Performance monitoring utilities for Core Web Vitals and custom metrics
 */
import { onCLS, onLCP, onTTFB, onFCP, onINP } from 'web-vitals';
import type { Metric } from 'web-vitals';

export interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number;  // Largest Contentful Paint
  FID?: number;  // First Input Delay
  CLS?: number;  // Cumulative Layout Shift
  FCP?: number;  // First Contentful Paint
  TTFB?: number; // Time to First Byte
  INP?: number;  // Interaction to Next Paint

  // Custom metrics
  pageLoadTime?: number;
  domContentLoaded?: number;
  resourceLoadTime?: number;
  imageLoadTime?: number;
}

export interface PerformanceThresholds {
  LCP: { good: number; needsImprovement: number };
  FID: { good: number; needsImprovement: number };
  CLS: { good: number; needsImprovement: number };
  FCP: { good: number; needsImprovement: number };
  TTFB: { good: number; needsImprovement: number };
  INP: { good: number; needsImprovement: number };
}

/**
 * Google's Core Web Vitals thresholds
 * @see https://web.dev/defining-core-web-vitals-thresholds/
 */
export const WEB_VITALS_THRESHOLDS: PerformanceThresholds = {
  LCP: { good: 2500, needsImprovement: 4000 },      // milliseconds
  FID: { good: 100, needsImprovement: 300 },        // milliseconds
  CLS: { good: 0.1, needsImprovement: 0.25 },       // score
  FCP: { good: 1800, needsImprovement: 3000 },      // milliseconds
  TTFB: { good: 800, needsImprovement: 1800 },      // milliseconds
  INP: { good: 200, needsImprovement: 500 },        // milliseconds
};

/**
 * Get performance rating based on metric value and thresholds
 */
export function getPerformanceRating(
  metric: keyof PerformanceThresholds,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metric];
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Collect basic performance metrics from the Performance API
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const metrics: PerformanceMetrics = {};

  if (navigation) {
    // Page load time
    metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    // DOM Content Loaded  
    metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    
    // Time to First Byte
    metrics.TTFB = navigation.responseStart - navigation.fetchStart;
    
    // Resource load time
    metrics.resourceLoadTime = navigation.loadEventStart - navigation.domContentLoadedEventEnd;
  }

  // First Contentful Paint
  const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
  if (fcp) {
    metrics.FCP = fcp.startTime;
  }

  return metrics;
}

/**
 * Monitor image loading performance
 */
export function monitorImagePerformance(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(0);
      return;
    }

    const images = document.querySelectorAll('img');
    const imagePromises: Promise<void>[] = [];
    const startTime = performance.now();

    images.forEach((img) => {
      if (img.complete) {
        return; // Already loaded
      }

      const promise = new Promise<void>((resolveImg) => {
        const onLoad = () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onLoad);
          resolveImg();
        };

        img.addEventListener('load', onLoad);
        img.addEventListener('error', onLoad);
      });

      imagePromises.push(promise);
    });

    Promise.all(imagePromises).then(() => {
      const endTime = performance.now();
      resolve(endTime - startTime);
    });
  });
}

/**
 * Performance observer for Core Web Vitals using official web-vitals library
 */
export class WebVitalsObserver {
  private metrics: Partial<PerformanceMetrics> = {};
  // eslint-disable-next-line no-unused-vars
  private callbacks: Array<(metrics: Partial<PerformanceMetrics>) => void> = [];
  private fidObserver?: PerformanceObserver;
  // Optional outbound metric bridge (analytics)
  // eslint-disable-next-line no-unused-vars
  private onMetric?: (metric: {
    name: keyof PerformanceThresholds;
    value: number;
    id: string;
    rating: 'good' | 'needs-improvement' | 'poor';
  }) => void;

  // eslint-disable-next-line no-unused-vars
  constructor(options?: { onMetric?: (metric: any) => void }) {
    this.onMetric = options?.onMetric;
    if (typeof window !== 'undefined') {
      this.initWebVitals();
    }
  }

  private initWebVitals() {
    // Use official web-vitals library for accurate tracking with error handling
    try {
      onLCP((metric: Metric) => {
        this.updateMetric('LCP', metric.value);
        this.onMetric?.({
          name: 'LCP',
          value: metric.value,
          id: metric.id,
          rating: getPerformanceRating('LCP', metric.value),
        });
      });
    } catch (error) {
      console.warn('LCP tracking failed:', error);
    }

    try {
      onCLS((metric: Metric) => {
        this.updateMetric('CLS', metric.value);
        this.onMetric?.({
          name: 'CLS',
          value: metric.value,
          id: metric.id,
          rating: getPerformanceRating('CLS', metric.value),
        });
      });
    } catch (error) {
      console.warn('CLS tracking failed:', error);
    }

    // FID tracking through PerformanceObserver (legacy support)
    try {
      if ('PerformanceObserver' in window) {
        this.fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            const fidValue = (entry as any).processingStart - entry.startTime;
            this.updateMetric('FID', fidValue);
            const id =
              globalThis.crypto?.randomUUID?.() ??
              `FID-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            this.onMetric?.({
              name: 'FID',
              value: fidValue,
              id,
              rating: getPerformanceRating('FID', fidValue),
            });
          }
        });
        this.fidObserver.observe({ entryTypes: ['first-input'] });
      }
    } catch (error) {
      console.warn('FID tracking failed:', error);
    }

    try {
      onFCP((metric: Metric) => {
        this.updateMetric('FCP', metric.value);
        this.onMetric?.({
          name: 'FCP',
          value: metric.value,
          id: metric.id,
          rating: getPerformanceRating('FCP', metric.value),
        });
      });
    } catch (error) {
      console.warn('FCP tracking failed:', error);
    }

    try {
      onTTFB((metric: Metric) => {
        this.updateMetric('TTFB', metric.value);
        this.onMetric?.({
          name: 'TTFB',
          value: metric.value,
          id: metric.id,
          rating: getPerformanceRating('TTFB', metric.value),
        });
      });
    } catch (error) {
      console.warn('TTFB tracking failed:', error);
    }

    try {
      // Finally implement proper INP tracking
      onINP((metric: Metric) => {
        this.updateMetric('INP', metric.value);
        this.onMetric?.({
          name: 'INP',
          value: metric.value,
          id: metric.id,
          rating: getPerformanceRating('INP', metric.value),
        });
      });
    } catch (error) {
      console.warn('INP tracking failed:', error);
    }
  }

  private updateMetric(name: keyof PerformanceMetrics, value: number) {
    // Validate metric value to prevent NaN/invalid values
    if (!Number.isFinite(value) || value < 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Invalid ${name} value: ${value}. Skipping update.`);
      }
      return;
    }
    
    this.metrics[name] = value;
    this.callbacks.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Error in performance callback for ${name}:`, error);
        }
      }
    });
  }

  // eslint-disable-next-line no-unused-vars
  public onMetricUpdate(callback: (metrics: Partial<PerformanceMetrics>) => void) {
    this.callbacks.push(callback);
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public disconnect() {
    this.callbacks = [];
    this.metrics = {};
    this.fidObserver?.disconnect();
    this.fidObserver = undefined;
  }
}

/**
 * Create and return a singleton instance of WebVitalsObserver
 */
let vitalsObserver: WebVitalsObserver | null = null;

export function getWebVitalsObserver(): WebVitalsObserver {
  if (!vitalsObserver) {
    vitalsObserver = new WebVitalsObserver();
  }
  return vitalsObserver;
}

/**
 * Log performance metrics with color coding based on ratings
 */
export function logPerformanceMetrics(metrics: Partial<PerformanceMetrics>) {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('🚀 Performance Metrics');
  
  Object.entries(metrics).forEach(([key, value]) => {
    if (value === undefined) return;
    
    const metricKey = key as keyof PerformanceThresholds;
    if (metricKey in WEB_VITALS_THRESHOLDS) {
      const rating = getPerformanceRating(metricKey, value);
      const color = rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'orange' : 'red';
      
      console.log(
        `%c${key}: ${value.toFixed(2)}${metricKey === 'CLS' ? '' : 'ms'} (${rating})`,
        `color: ${color}; font-weight: bold`
      );
    } else {
      console.log(`${key}: ${value.toFixed(2)}ms`);
    }
  });
  
  console.groupEnd();
}