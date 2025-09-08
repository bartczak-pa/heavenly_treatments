import OptimizedImage from '@/components/OptimizedImage';
import React from 'react';

const MyStudio = () => {
    return (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">My studio</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  Nestled on the tranquil outskirts of Kelso, my charming cottage spa offers a serene retreat from the hustle and bustle of everyday life. Surrounded by nature, my home spa provides a peaceful ambiance where you can indulge in luxurious treatments designed to rejuvenate your body and mind.
                </p>
                <p className="text-gray-700 mb-4">
                  Experience personalized care with my range of services, from soothing massages to revitalizing facials in the comfort of our cozy cottage setting.
                </p>
                <p className="text-gray-700">
                  Book your appointment today and discover the ultimate escape at our cottage spa in Kelso.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg mx-auto md:mx-0">
                  <OptimizedImage
                    src="heavenly-treatments-room"
                    fallback="/images/about/heavenly-treatments-room.jpg"
                    alt="Spa Studio"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}

export default MyStudio;