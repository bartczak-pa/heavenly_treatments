import OptimizedImage from '@/components/OptimizedImage';
import React from 'react';

interface MyStudioProps {
  className?: string;
}

// Static content moved outside component to prevent recreation on renders
const STUDIO_CONTENT = {
  title: "My studio",
  description: "Nestled on the tranquil outskirts of Kelso, my charming cottage spa offers a serene retreat from the hustle and bustle of everyday life. Surrounded by nature, my home spa provides a peaceful ambiance where you can indulge in luxurious treatments designed to rejuvenate your body and mind.",
  features: [
    {
      title: "Private & Peaceful",
      description: "Your treatment takes place in a dedicated, professional therapy room within my cottage. You'll have complete privacy in a calm, tranquil environment away from the noise of a busy salon."
    },
    {
      title: "Premium Atmosphere",
      description: "Every detail is carefully considered – from soothing aromatherapy scents and gentle music to comfortable treatment tables and premium linens. The ambiance is designed to help you relax from the moment you arrive."
    },
    {
      title: "Easy Access & Parking",
      description: "Free, convenient parking is available right at the cottage. Located on the outskirts of Kelso, you can enjoy the peaceful rural setting while being just minutes from town."
    }
  ],
  practicalInfo: {
    title: "What to Expect",
    items: [
      "Complimentary refreshments before and after your treatment",
      "Changing facilities and storage for your belongings",
      "All products and equipment provided",
      "Comfortable temperature control for your comfort",
      "Strict hygiene protocols and fresh linens for every client"
    ]
  }
} as const;

const MyStudio: React.FC<MyStudioProps> = ({ className = "" }) => {
  return (
    <section
      className={`py-16 bg-gray-50 ${className}`}
      aria-labelledby="studio-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 id="studio-heading" className="text-3xl font-bold mb-8 text-center">
          {STUDIO_CONTENT.title}
        </h2>

        {/* Main description with image */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-center mb-12">
          <div className="lg:w-1/2">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {STUDIO_CONTENT.description}
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:h-[450px] rounded-lg overflow-hidden shadow-lg mx-auto lg:mx-0">
              <OptimizedImage
                src="heavenly-treatments-room"
                fallback="/images/about/heavenly-treatments-room.jpg"
                alt="Professional spa treatment room at Heavenly Treatments cottage spa in Kelso"
                fill
                aspectRatio="4/5"
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STUDIO_CONTENT.features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Practical information */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-semibold text-primary mb-6 text-center">
            {STUDIO_CONTENT.practicalInfo.title}
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {STUDIO_CONTENT.practicalInfo.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MyStudio;