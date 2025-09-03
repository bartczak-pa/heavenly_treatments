'use client';

import { useEffect } from 'react';

interface JSONLDScriptProps {
  data: object | object[];
  id: string;
}

/**
 * Client component for JSON-LD structured data
 * This avoids the need for server-side headers() call, preserving SSG
 * Uses DOM manipulation to avoid CSP issues with dangerouslySetInnerHTML
 */
export function JSONLDScript({ data, id }: JSONLDScriptProps) {
  useEffect(() => {
    // Create script element for JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    
    // Append to head
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [data, id]);

  return null; // This component doesn't render anything
}