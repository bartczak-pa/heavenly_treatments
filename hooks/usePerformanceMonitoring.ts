'use client';

import { useEffect, useRef, useState } from 'react';
import { getWebVitalsObserver, getPerformanceMetrics, monitorImagePerformance, logPerformanceMetrics, type PerformanceMetrics } from '@/lib/performance';

export interface PerformanceData extends PerformanceMetrics {
  isLoading: boolean;
  imageLoadTime?: number;
  customMetrics: Record<string, number>;
}

/**
 * Custom hook for monitoring page and component performance
 */
export function usePerformanceMonitoring(options: {
  enableImageMonitoring?: boolean;
  enableConsoleLogging?: boolean;
  trackCustomMetrics?: boolean;
} = {}) {
  const {
    enableImageMonitoring = false,
    enableConsoleLogging = process.env.NODE_ENV === 'development',
    trackCustomMetrics = false,
  } = options;

  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    isLoading: true,
    customMetrics: {},
  });

  const vitalsObserverRef = useRef<ReturnType<typeof getWebVitalsObserver> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    startTimeRef.current = performance.now();

    // Initialize Web Vitals observer
    vitalsObserverRef.current = getWebVitalsObserver();
    
    // Listen for metric updates
    vitalsObserverRef.current.onMetricUpdate((metrics) => {
      setPerformanceData(prev => ({
        ...prev,
        ...metrics,
        isLoading: false,
      }));

      if (enableConsoleLogging) {
        logPerformanceMetrics(metrics);
      }
    });

    // Get initial performance metrics
    const initialMetrics = getPerformanceMetrics();
    setPerformanceData(prev => ({
      ...prev,
      ...initialMetrics,
    }));

    // Monitor image loading if enabled
    if (enableImageMonitoring) {
      monitorImagePerformance().then((imageLoadTime) => {
        setPerformanceData(prev => ({
          ...prev,
          imageLoadTime,
        }));
      });
    }

    // Clean up on unmount
    return () => {
      if (vitalsObserverRef.current) {
        vitalsObserverRef.current.disconnect();
      }
    };
  }, [enableImageMonitoring, enableConsoleLogging]);

  /**
   * Add custom performance metric
   */
  const addCustomMetric = (name: string, value: number) => {
    if (!trackCustomMetrics) return;

    setPerformanceData(prev => ({
      ...prev,
      customMetrics: {
        ...prev.customMetrics,
        [name]: value,
      },
    }));

    if (enableConsoleLogging) {
      console.log(`📊 Custom Metric - ${name}: ${value.toFixed(2)}ms`);
    }
  };

  /**
   * Measure execution time of a function
   */
  const measureAsync = async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      addCustomMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      addCustomMetric(`${name}_error`, duration);
      throw error;
    }
  };

  /**
   * Measure execution time of a synchronous function
   */
  const measure = <T>(name: string, fn: () => T): T => {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      addCustomMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      addCustomMetric(`${name}_error`, duration);
      throw error;
    }
  };

  /**
   * Start a timer for manual measurement
   */
  const startTimer = (name: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      addCustomMetric(name, duration);
      return duration;
    };
  };

  /**
   * Get time since hook initialization
   */
  const getTimeSinceInit = (): number => {
    return performance.now() - startTimeRef.current;
  };

  return {
    performanceData,
    addCustomMetric,
    measureAsync,
    measure,
    startTimer,
    getTimeSinceInit,
  };
}

/**
 * Hook for tracking specific component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const [renderMetrics, setRenderMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
  });

  useEffect(() => {
    const renderStart = performance.now();
    renderCountRef.current += 1;

    // Measure render time on next tick
    const timeoutId = setTimeout(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      lastRenderTimeRef.current = renderTime;

      setRenderMetrics(prev => {
        const newTotalTime = prev.totalRenderTime + renderTime;
        const newAverageTime = newTotalTime / renderCountRef.current;

        return {
          renderCount: renderCountRef.current,
          lastRenderTime: renderTime,
          averageRenderTime: newAverageTime,
          totalRenderTime: newTotalTime,
        };
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `🔄 ${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`
        );
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return renderMetrics;
}