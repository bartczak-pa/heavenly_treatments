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
import { ComponentType, type JSX, Suspense } from 'react';
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
    <output
      className={cn(
        'bg-muted rounded-md',
        priorityStyles[priority],
        'motion-reduce:animate-none',
        className || 'h-32'
      )}
      aria-live={priority === 'high' ? 'assertive' : 'polite'}
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {showText && (
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground text-sm">Loading…</div>
        </div>
      )}
    </output>
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
        aria-label="Reload the page"
      >
        Reload page
      </button>
    )}
  </div>
);

/**
 * Enhanced wrapper for dynamic imports with error boundaries and retry logic
 */
function withDynamicBoundary<P extends Record<string, any>>(
  DynamicComponent: ComponentType<P>,
  fallbackProps?: LoadingConfig
) {
  return function BoundedDynamicComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={
          <DynamicErrorFallback
            retry={() => window.location.reload()}
          />
        }
      >
        <Suspense fallback={<ComponentLoader {...fallbackProps} />}>
          <DynamicComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Dynamic imports for heavy/non-critical components with webpack chunk names
// Note: SSR flags are removed since this is a client component ('use client')

// Contact Form - Heavy component with many dependencies (react-hook-form, zod, turnstile)
const DynamicContactFormCore = dynamic(
  () => import(/* webpackChunkName: "contact-form" */ '@/components/Contact/ContactForm'),
  {
    loading: () => (
      <ComponentLoader
        className="h-96"
        priority="normal"
        ariaLabel="Loading contact form"
      />
    ),
  }
);

export const DynamicContactForm = withDynamicBoundary(DynamicContactFormCore, {
  className: 'h-96',
  ariaLabel: 'Loading contact form'
});

// Map Embed - Third-party iframe, not critical for initial render
const DynamicMapEmbedCore = dynamic(
  () => import(/* webpackChunkName: "map-embed" */ '@/components/Contact/MapEmbed'),
  {
    loading: () => (
      <ComponentLoader
        className="h-64"
        priority="low"
        ariaLabel="Loading map"
      />
    ),
  }
);

export const DynamicMapEmbed = withDynamicBoundary(DynamicMapEmbedCore, {
  className: 'h-64',
  ariaLabel: 'Loading map'
});

// Cookie Consent - Not critical for initial render, user interaction dependent
const DynamicCookieConsentWrapperCore = dynamic(
  () => import(/* webpackChunkName: "cookie-consent" */ '@/components/Layout/CookieConsentWrapper'),
  {
    loading: () => null, // No loader needed for cookie consent
  }
);

export const DynamicCookieConsentWrapper = withDynamicBoundary(DynamicCookieConsentWrapperCore);

// Testimonials - Can be loaded after initial page render for better performance
const DynamicTestimonialsCore = dynamic(
  () => import(/* webpackChunkName: "testimonials" */ '@/components/Sections/Testimonials'),
  {
    loading: () => (
      <ComponentLoader
        className="h-48"
        priority="normal"
        ariaLabel="Loading testimonials"
      />
    ),
  }
);

export const DynamicTestimonials = withDynamicBoundary(DynamicTestimonialsCore, {
  className: 'h-48',
  ariaLabel: 'Loading testimonials'
});

// Experience Section - Nice to have but not critical for above-the-fold
const DynamicExperienceSectionCore = dynamic(
  () => import(/* webpackChunkName: "experience-section" */ '@/components/Sections/Experience'),
  {
    loading: () => (
      <ComponentLoader
        className="h-64"
        priority="normal"
        ariaLabel="Loading experience section"
      />
    ),
  }
);

export const DynamicExperienceSection = withDynamicBoundary(DynamicExperienceSectionCore, {
  className: 'h-64',
  ariaLabel: 'Loading experience section'
});

// Services Section - Important for SEO but can be split for performance  
const DynamicServicesSectionCore = dynamic(
  () => import(/* webpackChunkName: "services-section" */ '@/components/Sections/Services'),
  {
    loading: () => (
      <ComponentLoader
        className="h-80"
        priority="high"
        ariaLabel="Loading services section"
      />
    ),
  }
);

export const DynamicServicesSection = withDynamicBoundary(DynamicServicesSectionCore, {
  className: 'h-80',
  ariaLabel: 'Loading services section',
  priority: 'high'
});

// Filtered Treatments Display - Heavy component with filtering logic
const DynamicFilteredTreatmentsDisplayCore = dynamic(
  () => import(/* webpackChunkName: "treatments-display" */ '@/components/Treatments/FilteredTreatmentsDisplay'),
  {
    loading: () => (
      <ComponentLoader
        className="h-96"
        priority="high"
        ariaLabel="Loading treatments"
      />
    ),
  }
);

export const DynamicFilteredTreatmentsDisplay = withDynamicBoundary(DynamicFilteredTreatmentsDisplayCore, {
  className: 'h-96',
  ariaLabel: 'Loading treatments',
  priority: 'high'
});

// Category Filters - Interactive component, can be loaded dynamically
const DynamicCategoryFiltersCore = dynamic(
  () => import(/* webpackChunkName: "category-filters" */ '@/components/Treatments/CategoryFilters'),
  {
    loading: () => (
      <ComponentLoader
        className="h-16"
        priority="high"
        ariaLabel="Loading filters"
        showText={false}
      />
    ),
  }
);

export const DynamicCategoryFilters = withDynamicBoundary(DynamicCategoryFiltersCore, {
  className: 'h-16',
  ariaLabel: 'Loading filters',
  priority: 'high',
  showText: false
});

// Google Analytics - Third-party script, not critical for initial render
const DynamicGoogleAnalyticsCore = dynamic(
  () => import(/* webpackChunkName: "google-analytics" */ '@/components/Analytics/GoogleAnalytics'),
  {
    loading: () => null,
  }
);

export const DynamicGoogleAnalytics = withDynamicBoundary(DynamicGoogleAnalyticsCore);

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
  /** Webpack chunk name for better debugging */
  chunkName?: string;
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