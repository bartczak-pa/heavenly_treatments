import OptimizedImage from '@/components/OptimizedImage';
import React from 'react';

interface MyStudioProps {
  className?: string;
}

const STUDIO_CONTENT = {
  title: "My studio",
  paragraphs: [
    "Nestled on the tranquil outskirts of Kelso, my charming cottage spa offers a serene retreat from the hustle and bustle of everyday life. Surrounded by nature, my home spa provides a peaceful ambiance where you can indulge in luxurious treatments designed to rejuvenate your body and mind.",
    "Experience personalized care with my range of services, from soothing massages to revitalizing facials in the comfort of our cozy cottage setting.",
    "Book your appointment today and discover the ultimate escape at our cottage spa in Kelso."
  ]
} as const;

const MyStudio: React.FC<MyStudioProps> = ({ className = "" }) => {
  return (
    <section 
      className={`py-16 bg-gray-50 ${className}`}
      aria-labelledby="studio-heading"
      role="region"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="studio-heading" className="text-3xl font-bold mb-8">
          {STUDIO_CONTENT.title}
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-center">
          <div className="lg:w-2/3" role="main">
            <div className="space-y-4 text-gray-700">
              {STUDIO_CONTENT.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2" role="img" aria-labelledby="studio-image">
            <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-lg overflow-hidden shadow-lg mx-auto lg:mx-0">
              <OptimizedImage
                src="heavenly-treatments-room"
                fallback="/images/about/heavenly-treatments-room.jpg"
                alt="Tranquil spa studio interior featuring comfortable treatment space in Kelso cottage setting"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyStudio;