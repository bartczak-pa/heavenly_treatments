import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollTracking } from '@/hooks/useScrollTracking';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test-page'),
}));

// Mock the ga4 module
vi.mock('@/lib/analytics/ga4', () => ({
  trackScrollDepth: vi.fn(),
}));

import { trackScrollDepth } from '@/lib/analytics/ga4';
import { usePathname } from 'next/navigation';

/** Throttle delay used in useScrollTracking */
const SCROLL_THROTTLE_MS = 150;

describe('useScrollTracking', () => {
  let scrollHandler: ((event: Event) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    scrollHandler = null;

    // Mock window properties for scroll calculations
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    });

    // Capture scroll event listener
    vi.spyOn(window, 'addEventListener').mockImplementation(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === 'scroll') {
          scrollHandler = handler as (event: Event) => void;
        }
      }
    );

    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should add scroll event listener on mount', () => {
    renderHook(() => useScrollTracking());

    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
  });

  it('should remove scroll event listener on unmount', () => {
    const { unmount } = renderHook(() => useScrollTracking());

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });

  it('should track scroll at 25% threshold', () => {
    // Mock document.title
    Object.defineProperty(document, 'title', { value: 'Test Page', writable: true });

    renderHook(() => useScrollTracking());

    // Simulate scroll to 25%
    // scrollHeight = 2000, innerHeight = 800, so scrollable = 1200
    // 25% of 1200 = 300
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });

    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    expect(trackScrollDepth).toHaveBeenCalledWith({
      percent_scrolled: 25,
      page_path: '/test-page',
      page_title: 'Test Page',
    });
  });

  it('should track scroll at multiple thresholds sequentially', () => {
    renderHook(() => useScrollTracking());

    // scrollHeight = 2000, innerHeight = 800, scrollable = 1200

    // Scroll to 25% (300px)
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Advance time past throttle delay
    act(() => {
      vi.advanceTimersByTime(SCROLL_THROTTLE_MS);
    });

    // Scroll to 50% (600px)
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Advance time past throttle delay
    act(() => {
      vi.advanceTimersByTime(SCROLL_THROTTLE_MS);
    });

    // Scroll to 75% (900px)
    Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    expect(trackScrollDepth).toHaveBeenCalledTimes(3);
  });

  it('should NOT track same threshold twice', () => {
    renderHook(() => useScrollTracking());

    // Scroll to 25%
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Scroll back and forth around 25%
    Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    Object.defineProperty(window, 'scrollY', { value: 320, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Should only track 25% once
    expect(trackScrollDepth).toHaveBeenCalledTimes(1);
  });

  it('should use custom thresholds when provided', () => {
    // Mock document.title
    Object.defineProperty(document, 'title', { value: 'Custom Page', writable: true });

    renderHook(() => useScrollTracking({ thresholds: [10, 50, 100] }));

    // Scroll to 10% (120px)
    Object.defineProperty(window, 'scrollY', { value: 120, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    expect(trackScrollDepth).toHaveBeenCalledWith({
      percent_scrolled: 10,
      page_path: '/test-page',
      page_title: 'Custom Page',
    });
  });

  it('should NOT track when disabled', () => {
    renderHook(() => useScrollTracking({ enabled: false }));

    // Scroll to 50%
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Listener shouldn't even be added when disabled
    expect(trackScrollDepth).not.toHaveBeenCalled();
  });

  it('should reset tracked thresholds when pathname changes', () => {
    // Mock document.title
    Object.defineProperty(document, 'title', { value: 'Test Page', writable: true });

    const { rerender } = renderHook(() => useScrollTracking());

    // Scroll to 25%
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    expect(trackScrollDepth).toHaveBeenCalledTimes(1);

    // Simulate pathname change
    vi.mocked(usePathname).mockReturnValue('/new-page');
    rerender();

    // Scroll to 25% again on new page
    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Should track again because it's a new page
    expect(trackScrollDepth).toHaveBeenCalledTimes(2);
    expect(trackScrollDepth).toHaveBeenLastCalledWith({
      percent_scrolled: 25,
      page_path: '/new-page',
      page_title: 'Test Page',
    });
  });

  it('should handle zero scrollable height gracefully', () => {
    // Page content fits in viewport (no scroll)
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    renderHook(() => useScrollTracking());

    act(() => {
      scrollHandler?.(new Event('scroll'));
    });

    // Should not track anything
    expect(trackScrollDepth).not.toHaveBeenCalled();
  });
});
