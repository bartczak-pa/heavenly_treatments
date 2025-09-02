'use client';

import React, { useState } from 'react';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { getPerformanceRating, WEB_VITALS_THRESHOLDS } from '@/lib/performance';

interface PerformanceDashboardProps {
  /**
   * Show the dashboard by default
   * @default false
   */
  defaultVisible?: boolean;
  
  /**
   * Position of the dashboard
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Development performance dashboard for monitoring Core Web Vitals
 * Only renders in development mode
 */
export function PerformanceDashboard({ 
  defaultVisible = false, 
  position = 'bottom-right' 
}: PerformanceDashboardProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const { performanceData } = usePerformanceMonitoring({
    enableImageMonitoring: true,
    enableConsoleLogging: false, // Disable console logging when dashboard is shown
    trackCustomMetrics: true,
  });

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getMetricColor = (metricName: string, value: number) => {
    if (metricName in WEB_VITALS_THRESHOLDS) {
      const rating = getPerformanceRating(metricName as keyof typeof WEB_VITALS_THRESHOLDS, value);
      return rating === 'good' ? 'text-green-600' : rating === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-blue-600';
  };

  const formatMetricValue = (metricName: string, value: number) => {
    if (metricName === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
          title="Show Performance Dashboard"
        >
          📊 Performance
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-80 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              📊 Performance Metrics
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              title="Hide Dashboard"
            >
              ×
            </button>
          </div>

          {performanceData.isLoading ? (
            <div className="text-gray-500 text-sm">Loading metrics...</div>
          ) : (
            <div className="space-y-2">
              {/* Core Web Vitals */}
              <div className="border-b border-gray-100 pb-2">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Core Web Vitals
                </h4>
                
                {performanceData.LCP && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">LCP:</span>
                    <span className={getMetricColor('LCP', performanceData.LCP)}>
                      {formatMetricValue('LCP', performanceData.LCP)}
                    </span>
                  </div>
                )}
                
                {performanceData.FID && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">FID:</span>
                    <span className={getMetricColor('FID', performanceData.FID)}>
                      {formatMetricValue('FID', performanceData.FID)}
                    </span>
                  </div>
                )}
                
                {performanceData.CLS !== undefined && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">CLS:</span>
                    <span className={getMetricColor('CLS', performanceData.CLS)}>
                      {formatMetricValue('CLS', performanceData.CLS)}
                    </span>
                  </div>
                )}
                
                {performanceData.FCP && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">FCP:</span>
                    <span className={getMetricColor('FCP', performanceData.FCP)}>
                      {formatMetricValue('FCP', performanceData.FCP)}
                    </span>
                  </div>
                )}
                
                {performanceData.TTFB && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">TTFB:</span>
                    <span className={getMetricColor('TTFB', performanceData.TTFB)}>
                      {formatMetricValue('TTFB', performanceData.TTFB)}
                    </span>
                  </div>
                )}
              </div>

              {/* Additional Metrics */}
              {(performanceData.pageLoadTime || performanceData.domContentLoaded || performanceData.imageLoadTime) && (
                <div className="border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                    Loading Metrics
                  </h4>
                  
                  {performanceData.pageLoadTime && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Page Load:</span>
                      <span className="text-blue-600">
                        {Math.round(performanceData.pageLoadTime)}ms
                      </span>
                    </div>
                  )}
                  
                  {performanceData.domContentLoaded && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">DOM Ready:</span>
                      <span className="text-blue-600">
                        {Math.round(performanceData.domContentLoaded)}ms
                      </span>
                    </div>
                  )}
                  
                  {performanceData.imageLoadTime && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Images:</span>
                      <span className="text-blue-600">
                        {Math.round(performanceData.imageLoadTime)}ms
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Metrics */}
              {Object.keys(performanceData.customMetrics).length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                    Custom Metrics
                  </h4>
                  {Object.entries(performanceData.customMetrics).map(([name, value]) => (
                    <div key={name} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 truncate" title={name}>
                        {name.length > 15 ? `${name.substring(0, 15)}...` : name}:
                      </span>
                      <span className="text-purple-600">
                        {Math.round(value)}ms
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Thresholds Legend */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">● Good</span>
                  <span className="text-yellow-600">● Needs Improvement</span>
                  <span className="text-red-600">● Poor</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}