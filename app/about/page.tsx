// app/about/page.tsx
import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh]">
          <div className="absolute inset-0">
            <Image
              src="/images/spa-about.jpg" //TODO: Replace with about page hero image
              alt="Spa Treatment Room"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center">About Heavenly Treatments</h1>
          </div>
        </section>

        {/* Meet Your Therapist */}
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

        {/* My Studio */}
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
              <div className="md:w-1/3">
                <Image
                  src="/images/studio.jpg" //TODO: Replace with studio image
                  alt="Spa Studio"
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Hours</h3>
                <p className="text-gray-700">Mon to Sun: 9 AM – 7 PM</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <p className="text-gray-700">6 EASTER SOFTLAW FARM COTTAGE</p>
                <p className="text-gray-700">TD5 8BJ KELSO</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <p className="text-gray-700">hayley@heavenly-treatments.co.uk</p>
                <p className="text-gray-700">07960 315337</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="py-16 bg-black text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Ready to experience tranquility?</h2>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Book Now
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}