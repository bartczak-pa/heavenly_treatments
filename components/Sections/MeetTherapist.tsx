import OptimizedImage from '@/components/OptimizedImage';
import React from 'react';

const MeetTherapist = () => {
    return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">Meet your therapist</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <OptimizedImage
                  src="/images/about/owner-of-heavenly-treatments.jpg"
                  alt="Spa Therapist"
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                I began my journey into spa therapy training at the prestigious Mary Reid Spa Academy in Edinburgh in 2007.  I gained further experience working in 5 star spas such as the Sheraton Hotel One Spa and Schloss as well as busy salons.
                </p>
                <p className="text-gray-700">
                I am now using all this experience to bring you the best possible treatments using brands and products I am passionate about.
                </p>
              </div>
            </div>
          </div>
        </section>
    )
}

export default MeetTherapist;