'use client';

import React from 'react';

/**
 * MapEmbed Component
 * 
 * A React component that renders an embedded Google Maps iframe.
 * The map URL is configured through the NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL environment variable.
 * 
 * @component
 * @example
 * ```tsx
 * <MapEmbed />
 * ```
 * 
 * @returns {JSX.Element} A responsive iframe containing the Google Maps embed
 * 
 * @remarks
 * - Uses environment variable NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL for the map URL
 * - Implements responsive design with aspect-video ratio
 * - Includes security best practices (referrerPolicy, loading="lazy")
 * - Falls back to empty string if environment variable is not set
 */


const MapEmbed: React.FC = () => {
  // Environment variable checked in @/env.d.ts
  // @eslint-disable-next-line
  const embedUrl: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md border border-border">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%" 
        style={{ border: 0 }}
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Heavenly Treatments Location Map"
      ></iframe>
    </div>
  );
};

export default MapEmbed;