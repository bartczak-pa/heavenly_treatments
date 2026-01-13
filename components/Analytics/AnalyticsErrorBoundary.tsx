'use client';

/**
 * Analytics Error Boundary Component
 *
 * A specialized error boundary for analytics components that fails silently.
 * Analytics failures should never break the user experience - they should
 * be logged and swallowed.
 *
 * @module components/Analytics/AnalyticsErrorBoundary
 */

import { Component, ReactNode, ErrorInfo } from 'react';

interface AnalyticsErrorBoundaryProps {
  children: ReactNode;
  /** Component name for error logging */
  componentName?: string;
}

interface AnalyticsErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary that silently catches analytics component errors.
 *
 * Use this to wrap analytics tracker components to prevent them from
 * breaking the page if they throw an error.
 *
 * @example
 * ```tsx
 * <AnalyticsErrorBoundary componentName="TreatmentViewTracker">
 *   <TreatmentViewTracker {...props} />
 * </AnalyticsErrorBoundary>
 * ```
 */
export class AnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AnalyticsErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log in development - don't pollute production logs with analytics errors
    if (process.env.NODE_ENV !== 'production') {
      const componentName = this.props.componentName || 'Analytics';
      console.error(
        `[${componentName}] Error caught by analytics boundary:`,
        error,
        errorInfo
      );
    }
  }

  render() {
    // Silently fail - analytics errors should never show UI
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
