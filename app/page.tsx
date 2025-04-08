import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/spa-hero.jpg" //TODO:  Replace with hero image path
            alt="Luxury Spa Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            Experience Heavenly Treatments
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
            Indulge in luxury spa treatments designed to rejuvenate your body and soul.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Book Your Treatment
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Map through your services data here */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/massage.jpg" //TODO:  Replace with service image paths
                alt="Massage Therapy"
                width={400}
                height={300}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">Massage Therapy</h3>
                  <p className="text-gray-200">Professional massage treatments to relieve stress and tension.</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/facial.jpg" //TODO:  Replace with service image paths
                alt="Facial Treatments"
                width={400}
                height={300}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">Facial Treatments</h3>
                  <p className="text-gray-200">Luxurious facials for glowing, healthy skin.</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/body-treatment.jpg" //TODO:   Replace with service image paths
                alt="Body Treatments"
                width={400}
                height={300}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">Body Treatments</h3>
                  <p className="text-gray-200">Rejuvenating body treatments for complete relaxation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Map through your testimonials data here */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/avatar-1.jpg" //TODO:  Replace with avatar image paths
                  alt="Sarah Johnson"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500">Regular Client</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;The best spa experience I&apos;ve ever had. The staff is amazing and the treatments are heavenly!&quot;</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/avatar-2.jpg" //TODO:  Replace with avatar image paths
                  alt="Michael Brown"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-gray-500">First-time Visitor</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Incredible service and atmosphere. I&apos;ll definitely be coming back!&quot;</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/avatar-3.jpg" //TODO:  Replace with avatar image paths
                  alt="Emily Davis"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Emily Davis</h4>
                  <p className="text-gray-500">VIP Member</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;Heavenly Treatments has become my sanctuary. The perfect place to unwind and recharge.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Heaven?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your appointment today and start your journey to relaxation and rejuvenation.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Book Now
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;