/**
 * @fileoverview Enhanced dynamic component imports with error boundaries and performance optimization
 *
 * This module provides dynamically imported components with comprehensive error handling,
 * accessibility features, and performance optimizations. Features include:
 * - Error boundaries with retry mechanisms for failed imports
 * - Configurable loading states with priority levels and reduced motion support
 * - Webpack chunk naming for better debugging and caching
 * - Enhanced accessibility with proper ARIA labels and semantic markup
 * - Type-safe component factory with flexible configuration options
 *
 * @author Pawel Bartczak
 * @version 2.0.0
 */

'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, JSX } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

/**
 * Loading priority levels for dynamic components
 */
export type LoadingPriority = 'low' | 'normal' | 'high';

/**
 * Configuration for loading states
 */
interface LoadingConfig {
  className?: string;
  priority?: LoadingPriority;
  ariaLabel?: string;
  showText?: boolean;
}

/**
 * Enhanced loading fallback component with configurable states
 *
 * Displays an accessible loading indicator with proper ARIA attributes,
 * configurable priority levels, and reduced motion support.
 *
 * @param config - Loading configuration options
 * @returns JSX element representing the loading state
 */
const ComponentLoader = ({
  className,
  priority = 'normal',
  ariaLabel = 'Loading content',
  showText = true
}: LoadingConfig) => {
  const priorityStyles = {
    low: 'animate-[pulse_3s_ease-in-out_infinite]',
    normal: 'animate-[pulse_2s_ease-in-out_infinite]',
    high: 'animate-[pulse_1s_ease-in-out_infinite]'
  };

  return (
    <div
      className={cn(
        'bg-muted rounded-md',
        priorityStyles[priority],
        'motion-reduce:animate-none',
        className || 'h-32'
      )}
      role="status"
      aria-live={priority === 'high' ? 'assertive' : 'polite'}
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {showText && (
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground text-sm">Loading…</div>
        </div>
      )}
    </div>
  );
};

/**
 * Error fallback for failed dynamic imports
 */
const DynamicErrorFallback = ({ retry }: { retry?: () => void }) => (
  <div
    className="p-4 border border-destructive/20 rounded-md bg-destructive/5"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <h3 className="text-sm font-medium text-destructive">Failed to load component</h3>
    <p className="text-xs text-muted-foreground mt-1">Please try refreshing the page.</p>
    {retry && (
      <button
        type="button"
        className="mt-2 text-xs underline text-destructive hover:text-destructive/80"
        onClick={retry}
        aria-label="Reload"
      >
        Reload
      </button>
    )}
  </div>
);

/**
 * Enhanced wrapper for dynamic imports with error boundaries and retry logic
 */
function withDynamicBoundary<P extends Record<string, any>>(
  DynamicComponent: ComponentType<P>,
  _fallback?: LoadingConfig | null
) {
  function BoundedDynamicComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={<DynamicErrorFallback retry={() => window.location.reload()} />}
      >
        <DynamicComponent {...props} />
      </ErrorBoundary>
    );
  }

  BoundedDynamicComponent.displayName =
    `withDynamicBoundary(${(DynamicComponent as any).displayName ||
      (DynamicComponent as any).name ||
      'Component'})`;

  return BoundedDynamicComponent;
}

// Dynamic imports for heavy/non-critical components with webpack chunk names
// Note: SSR flags are removed since this is a client component ('use client')

// Contact Form - Heavy component with many dependencies (react-hook-form, zod, turnstile)
export const DynamicContactForm = createDynamicComponent(
  () => import(/* webpackChunkName: "contact-form" */ '@/components/Contact/ContactForm'),
  {
    className: 'h-96',
    ariaLabel: 'Loading contact form',
    priority: 'normal',
    withErrorBoundary: true,
  }
);

// Map Embed - Third-party iframe, not critical for initial render
export const DynamicMapEmbed = createDynamicComponent(
  () => import(/* webpackChunkName: "map-embed" */ '@/components/Contact/MapEmbed'),
  {
    className: 'h-64',
    ariaLabel: 'Loading map',
    priority: 'low',
    withErrorBoundary: true,
  }
);

// Cookie Consent - Not critical for initial render, user interaction dependent
export const DynamicCookieConsentWrapper = createDynamicComponent(
  () => import(/* webpackChunkName: "cookie-consent" */ '@/components/Layout/CookieConsentWrapper'),
  {
    withErrorBoundary: false, // No fallback UI needed for cookie consent
  }
);

// Testimonials - Can be loaded after initial page render for better performance
export const DynamicTestimonials = createDynamicComponent(
  () => import(/* webpackChunkName: "testimonials" */ '@/components/Sections/Testimonials'),
  {
    className: 'h-48',
    ariaLabel: 'Loading testimonials',
    priority: 'normal',
    withErrorBoundary: true,
  }
);

// Experience Section - Nice to have but not critical for above-the-fold
export const DynamicExperienceSection = createDynamicComponent(
  () => import(/* webpackChunkName: "experience-section" */ '@/components/Sections/Experience'),
  {
    className: 'h-64',
    ariaLabel: 'Loading experience section',
    priority: 'normal',
    withErrorBoundary: true,
  }
);

// Services Section - Important for SEO but can be split for performance  
export const DynamicServicesSection = createDynamicComponent(
  () => import(/* webpackChunkName: "services-section" */ '@/components/Sections/Services'),
  {
    className: 'h-80 [content-visibility:auto]',
    ariaLabel: 'Loading services section',
    priority: 'high',
    withErrorBoundary: true,
  }
);

// NOTE: Removed DynamicFilteredTreatmentsDisplay and DynamicCategoryFilters
// These are now imported statically in /app/treatments/page.tsx for better FCP
// They are critical above-the-fold components that should not be code-split

// Google Analytics - Third-party script, not critical for initial render
export const DynamicGoogleAnalytics = createDynamicComponent(
  () => import(/* webpackChunkName: "google-analytics" */ '@/components/Analytics/GoogleAnalytics'),
  {
    withErrorBoundary: false, // No fallback UI needed for analytics
  }
);

/**
 * Configuration options for dynamic component creation
 */
interface DynamicComponentOptions {
  /** Custom loading component function */
  loading?: () => JSX.Element;
  /** CSS class name for default loading component */
  className?: string;
  /** Loading priority level */
  priority?: LoadingPriority;
  /** Custom aria label for loading state */
  ariaLabel?: string;
  /** Whether to show loading text */
  showText?: boolean;
  /** Whether to wrap with error boundary (default: true) */
  withErrorBoundary?: boolean;
}

/**
 * Enhanced higher-order component factory for creating consistent dynamic imports
 *
 * Provides a standardized way to create dynamically imported components with:
 * - Consistent loading behavior and SSR configuration
 * - Error boundaries for failed imports
 * - Webpack chunk naming for better debugging
 * - Configurable loading priorities and accessibility
 * - Reduced motion support
 *
 * @template T - The component type being dynamically imported
 * @template P - The props type for the component
 * @param importFn - Function that returns a promise resolving to the component
 * @param options - Configuration options for the dynamic import
 * @returns Dynamically imported component with configured loading behavior
 *
 * @example
 * ```typescript
 * const DynamicMyComponent = createDynamicComponent(
 *   () => import('./MyComponent'),
 *   {
 *     className: 'h-64',
 *     priority: 'high',
 *     chunkName: 'my-component',
 *     ariaLabel: 'Loading my component'
 *   }
 * );
 * ```
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicComponentOptions = {}
) {
  const {
    loading,
    className,
    priority = 'normal',
    ariaLabel,
    showText = true,
    withErrorBoundary = true,
  } = options;

  const DynamicComponentCore = dynamic(importFn, {
    loading:
      loading ||
      (() => (
        <ComponentLoader
          className={className}
          priority={priority}
          ariaLabel={ariaLabel}
          showText={showText}
        />
      )),
  });

  if (!withErrorBoundary) {
    return DynamicComponentCore;
  }

  return withDynamicBoundary(DynamicComponentCore, {
    className,
    priority,
    ariaLabel,
    showText,
  });
}

// Re-export for easy importing
export {
  ComponentLoader,
  withDynamicBoundary,
  DynamicErrorFallback,
};

// Type exports
export type { LoadingConfig, DynamicComponentOptions };