'use client';

import Image from 'next/image';
import React from 'react';

const MeetTherapist = () => {
    return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">Meet your therapist</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <Image
                  src="/images/therapist.jpg" //TODO: Replace with therapist image
                  alt="Spa Therapist"
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  I&apos;ve always had a passion for healing and relaxation, knowing from a young age that my purpose was to help others find solace in the chaos. This led me to pursue a career in the spa industry.
                </p>
                <p className="text-gray-700">
                  At the prestigious Mary Reid International Spa Academy, I honed my skills and learned essential techniques. From soothing massages to rejuvenating facials, I immersed myself in the art of pampering.
                </p>
              </div>
            </div>
          </div>
        </section>
    )
}

export default MeetTherapist;