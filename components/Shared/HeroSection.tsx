import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, imageUrl }) => (
  <section className="relative h-[35vh] md:h-[40vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-1"></div>
    </div>
    <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3 drop-shadow-md text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="font-sans text-lg md:text-xl mb-6 drop-shadow-sm text-white/90">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default HeroSection;