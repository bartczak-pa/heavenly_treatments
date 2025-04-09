'use client';

import React from 'react';

const MapEmbed: React.FC<{ src: string }> = ({ src }) => (
    <div className="relative aspect-video md:aspect-square w-full h-auto md:h-full min-h-[300px] rounded-lg overflow-hidden shadow-md border border-border"> {/* Use aspect ratio, ensure min height */}
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" 
        title="Heavenly Treatments Location Map" 
        className="absolute inset-0"
      />
    </div>
  );

  export default MapEmbed;