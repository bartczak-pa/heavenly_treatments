'use client';

import { useEffect, useRef, useState } from 'react';

interface UseRevealResult<T extends HTMLElement> {
  /** Attach to the element you want to reveal. */
  ref: React.RefObject<T | null>;
  /** True once the element has entered the viewport (stays true — one-shot). */
  revealed: boolean;
}

/**
 * Scroll-reveal via IntersectionObserver.
 *
 * Returns a ref to attach and a `revealed` flag. Pair with the `[data-reveal]`
 * CSS in app/styles/globals.css: render `data-reveal={revealed}` on the element.
 *
 * SSR-safe: `revealed` starts false, and if IntersectionObserver is unavailable
 * we fall back to revealing immediately so content is never trapped hidden.
 *
 * Design intent (see plan): one-shot. Once revealed, stop observing so sections
 * settle and don't re-animate when scrolled back into view.
 */
export function useReveal<T extends HTMLElement>(): UseRevealResult<T> {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: if the browser can't observe, reveal now so nothing stays hidden.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el); // one-shot: settle and stop watching
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
