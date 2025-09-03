'use client';

import { useEffect } from 'react';

function stableStringify(value: unknown): string {
  return JSON.stringify(value, function (_k, v) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const obj = v as Record<string, unknown>;
      const sorted: Record<string, unknown> = {};
      for (const key of Object.keys(obj).sort()) {
        sorted[key] = obj[key];
      }
      return sorted;
    }
    return v;
  });
}

interface JSONLDScriptProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id: string;
  nonce?: string; // optional: pass from server; falls back to <meta name="csp-nonce">
}

/**
 * Client component for JSON-LD structured data
 * This avoids the need for server-side headers() call, preserving SSG
 * Uses DOM manipulation to avoid CSP issues with dangerouslySetInnerHTML
 */
export function JSONLDScript({ data, id, nonce }: JSONLDScriptProps) {
  useEffect(() => {
    // Create script element for JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = stableStringify(data);
    
    // Resolve nonce (prop takes precedence)
    const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content') || '';
    const effectiveNonce = nonce ?? metaNonce;
    if (effectiveNonce) {
      script.setAttribute('nonce', effectiveNonce);
    }
    
    // Remove existing script if it exists before appending
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    
    // Append to head
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [data, id, nonce]);

  return null; // This component doesn't render anything
}