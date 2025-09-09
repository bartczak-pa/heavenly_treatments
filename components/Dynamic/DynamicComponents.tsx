/**
 * @fileoverview Dynamic component imports for bundle optimization and code splitting
 * 
 * This module provides dynamically imported components to reduce initial bundle size
 * and improve Time to Interactive. Components are loaded on-demand with appropriate
 * loading fallbacks and SSR configuration based on their requirements.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading fallback component for better UX during code splitting
 * 
 * Displays an accessible loading indicator with proper ARIA attributes
 * while dynamic components are being loaded.
 * 
 * @param className - Optional CSS class names for styling
 * @returns JSX element representing the loading state
 */
const ComponentLoader = ({ className }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-muted rounded-md ${className || 'h-32'}`}
    role="status"
    aria-live="polite"
    aria-label="Loading component"
  >
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  </div>
);

// Dynamic imports for heavy/non-critical components

// Contact Form - Heavy component with many dependencies (react-hook-form, zod, turnstile)
export const DynamicContactForm = dynamic(
  () => import('@/components/Contact/ContactForm'),
  {
    loading: () => <ComponentLoader className="h-96" />,
    ssr: false, // Contact form doesn't need SSR for SEO
  }
);

// Map Embed - Third-party iframe, not critical for initial render
export const DynamicMapEmbed = dynamic(
  () => import('@/components/Contact/MapEmbed'),
  {
    loading: () => <ComponentLoader className="h-64" />,
    ssr: false, // Maps don't need SSR
  }
);

// Cookie Consent - Not critical for initial render, user interaction dependent
export const DynamicCookieConsentWrapper = dynamic(
  () => import('@/components/Layout/CookieConsentWrapper'),
  {
    loading: () => null, // No loader needed for cookie consent
    ssr: false, // Cookie consent is client-side only
  }
);

// Testimonials - Can be loaded after initial page render for better performance
export const DynamicTestimonials = dynamic(
  () => import('@/components/Sections/Testimonials'),
  {
    loading: () => <ComponentLoader className="h-48" />,
    ssr: true, // Keep SSR for SEO benefits
  }
);

// Experience Section - Nice to have but not critical for above-the-fold
export const DynamicExperienceSection = dynamic(
  () => import('@/components/Sections/Experience'),
  {
    loading: () => <ComponentLoader className="h-64" />,
    ssr: true, // Keep SSR for SEO
  }
);

// Services Section - Important for SEO but can be split for performance
export const DynamicServicesSection = dynamic(
  () => import('@/components/Sections/Services'),
  {
    loading: () => <ComponentLoader className="h-80" />,
    ssr: true, // Keep SSR for SEO
  }
);

// Filtered Treatments Display - Heavy component with filtering logic
export const DynamicFilteredTreatmentsDisplay = dynamic(
  () => import('@/components/Treatments/FilteredTreatmentsDisplay'),
  {
    loading: () => <ComponentLoader className="h-96" />,
    ssr: true, // Important for SEO
  }
);

// Category Filters - Interactive component, can be loaded dynamically
export const DynamicCategoryFilters = dynamic(
  () => import('@/components/Treatments/CategoryFilters'),
  {
    loading: () => <ComponentLoader className="h-16" />,
    ssr: true, // Important for SEO and navigation
  }
);

// Google Analytics - Third-party script, not critical for initial render
export const DynamicGoogleAnalytics = dynamic(
  () => import('@/components/Analytics/GoogleAnalytics'),
  {
    loading: () => null,
    ssr: false, // Analytics scripts are client-side only
  }
);

/**
 * Higher-order component factory for creating consistent dynamic imports
 * 
 * Provides a standardized way to create dynamically imported components
 * with consistent loading behavior and SSR configuration.
 * 
 * @template T - The component type being dynamically imported
 * @param importFn - Function that returns a promise resolving to the component
 * @param options - Configuration options for the dynamic import
 * @param options.loading - Custom loading component function
 * @param options.ssr - Whether to enable server-side rendering (default: true)
 * @param options.className - CSS class name for default loading component
 * @returns Dynamically imported component with configured loading behavior
 * 
 * @example
 * ```typescript
 * const DynamicMyComponent = createDynamicComponent(
 *   () => import('./MyComponent'),
 *   { ssr: false, className: 'h-64' }
 * );
 * ```
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: () => React.JSX.Element;
    ssr?: boolean;
    className?: string;
  } = {}
) {
  const { loading, ssr = true, className } = options;
  
  return dynamic(importFn, {
    loading: loading || (() => <ComponentLoader className={className} />),
    ssr,
  });
}

// Re-export for easy importing
export {
  ComponentLoader,
};