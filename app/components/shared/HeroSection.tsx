import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  description: string;
  imageUrl: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description, imageUrl }) => (
  <section className="relative mb-12 h-[40vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    </div>
    <div className="relative z-10 text-center text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{title}</h1>
      <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto drop-shadow-sm">
        {description}
      </p>
    </div>
  </section>
);

export default HeroSection;