import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOutboundTracking } from '@/hooks/useOutboundTracking';

// Mock the ga4 module
vi.mock('@/lib/analytics/ga4', () => ({
  trackOutboundClick: vi.fn(),
}));

import { trackOutboundClick } from '@/lib/analytics/ga4';

describe('useOutboundTracking', () => {
  let clickHandler: ((event: MouseEvent) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    clickHandler = null;

    // Mock window.location.hostname
    Object.defineProperty(window, 'location', {
      value: { hostname: 'example.com' },
      writable: true,
    });

    // Capture click event listener
    vi.spyOn(document, 'addEventListener').mockImplementation(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === 'click') {
          clickHandler = handler as (event: MouseEvent) => void;
        }
      }
    );

    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add click event listener on mount', () => {
    renderHook(() => useOutboundTracking());

    expect(document.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });

  it('should remove click event listener on unmount', () => {
    const { unmount } = renderHook(() => useOutboundTracking());

    unmount();

    expect(document.removeEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });

  it('should track outbound link clicks', () => {
    renderHook(() => useOutboundTracking());

    // Create mock link element
    const mockLink = document.createElement('a');
    mockLink.href = 'https://fresha.com/book';
    mockLink.textContent = 'Book Now';

    // Create mock event
    const mockEvent = {
      target: mockLink,
    } as unknown as MouseEvent;

    // Mock closest to return the link
    mockLink.closest = vi.fn().mockReturnValue(mockLink);

    act(() => {
      clickHandler?.(mockEvent);
    });

    expect(trackOutboundClick).toHaveBeenCalledWith({
      link_url: 'https://fresha.com/book',
      link_text: 'Book Now',
      link_domain: 'fresha.com',
    });
  });

  it('should NOT track internal link clicks', () => {
    renderHook(() => useOutboundTracking());

    const mockLink = document.createElement('a');
    mockLink.href = 'https://example.com/about';
    mockLink.textContent = 'About Us';

    const mockEvent = {
      target: mockLink,
    } as unknown as MouseEvent;

    mockLink.closest = vi.fn().mockReturnValue(mockLink);

    act(() => {
      clickHandler?.(mockEvent);
    });

    expect(trackOutboundClick).not.toHaveBeenCalled();
  });

  it('should NOT track clicks on non-link elements', () => {
    renderHook(() => useOutboundTracking());

    const mockButton = document.createElement('button');
    mockButton.textContent = 'Click me';

    const mockEvent = {
      target: mockButton,
    } as unknown as MouseEvent;

    // closest returns null for non-link elements
    mockButton.closest = vi.fn().mockReturnValue(null);

    act(() => {
      clickHandler?.(mockEvent);
    });

    expect(trackOutboundClick).not.toHaveBeenCalled();
  });

  it('should handle clicks on child elements of links', () => {
    renderHook(() => useOutboundTracking());

    // Create link with child span
    const mockLink = document.createElement('a');
    mockLink.href = 'https://external.com/page';
    const mockSpan = document.createElement('span');
    mockSpan.textContent = 'External Link';
    mockLink.appendChild(mockSpan);

    const mockEvent = {
      target: mockSpan,
    } as unknown as MouseEvent;

    // closest traverses up to find the link
    mockSpan.closest = vi.fn().mockReturnValue(mockLink);

    act(() => {
      clickHandler?.(mockEvent);
    });

    expect(trackOutboundClick).toHaveBeenCalledWith({
      link_url: 'https://external.com/page',
      link_text: 'External Link',
      link_domain: 'external.com',
    });
  });

  it('should NOT track links with same-domain href', () => {
    // Note: When href="" is set, browsers resolve it to the current page URL
    // So this tests that internal (same-domain) links are not tracked
    renderHook(() => useOutboundTracking());

    const mockLink = document.createElement('a');
    // Set href to same domain as window.location.hostname
    mockLink.href = 'https://example.com/about';

    const mockEvent = {
      target: mockLink,
    } as unknown as MouseEvent;

    mockLink.closest = vi.fn().mockReturnValue(mockLink);

    act(() => {
      clickHandler?.(mockEvent);
    });

    // Should not track because it's the same domain
    expect(trackOutboundClick).not.toHaveBeenCalled();
  });

  it('should handle invalid URLs gracefully', () => {
    renderHook(() => useOutboundTracking());

    const mockLink = document.createElement('a');
    // Set a value that will make URL constructor throw
    Object.defineProperty(mockLink, 'href', {
      get: () => 'javascript:void(0)',
    });

    const mockEvent = {
      target: mockLink,
    } as unknown as MouseEvent;

    mockLink.closest = vi.fn().mockReturnValue(mockLink);

    // Should not throw
    act(() => {
      expect(() => clickHandler?.(mockEvent)).not.toThrow();
    });

    // Should not track invalid URL
    expect(trackOutboundClick).not.toHaveBeenCalled();
  });

  it('should track long link text without truncation at hook level', () => {
    // Note: truncation to 100 chars happens in ga4.ts trackOutboundClick, not in the hook
    renderHook(() => useOutboundTracking());

    const mockLink = document.createElement('a');
    mockLink.href = 'https://external.com';
    mockLink.textContent = 'A'.repeat(200); // Very long text

    const mockEvent = {
      target: mockLink,
    } as unknown as MouseEvent;

    mockLink.closest = vi.fn().mockReturnValue(mockLink);

    act(() => {
      clickHandler?.(mockEvent);
    });

    expect(trackOutboundClick).toHaveBeenCalledWith({
      link_url: 'https://external.com/',
      link_text: 'A'.repeat(200), // Hook passes full text, ga4.ts truncates
      link_domain: 'external.com',
    });
  });

  it('should track social media link clicks', () => {
    renderHook(() => useOutboundTracking());

    const mockLink = document.createElement('a');
    mockLink.href = 'https://instagram.com/heavenlytreatments';
    mockLink.textContent = 'Follow us on Instagram';

    const mockEvent = {
      target: mockLink,
    } as unknown as MouseEvent;

    mockLink.closest = vi.fn().mockReturnValue(mockLink);

    act(() => {
      clickHandler?.(mockEvent);
    });

    expect(trackOutboundClick).toHaveBeenCalledWith({
      link_url: 'https://instagram.com/heavenlytreatments',
      link_text: 'Follow us on Instagram',
      link_domain: 'instagram.com',
    });
  });
});
