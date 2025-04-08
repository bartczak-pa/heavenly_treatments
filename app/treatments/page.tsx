'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';

const treatmentsData = {
  massages: [
    {
      id: 1,
      title: "Swedish Massage",
      description: "A relaxing massage that uses long strokes and kneading.",
      image: "/images/swedish-massage.jpg",
    },
    {
      id: 2,
      title: "Deep Tissue Massage",
      description: "A therapeutic massage that targets deeper layers of muscle.",
      image: "/images/deep-tissue-massage.jpg",
    },
  ],
  facials: [
    {
      id: 3,
      title: "Hydrating Facial",
      description: "A facial designed to hydrate and nourish the skin.",
      image: "/images/hydrating-facial.jpg",
    },
    {
      id: 4,
      title: "Anti-Aging Facial",
      description: "A facial that helps reduce the signs of aging.",
      image: "/images/anti-aging-facial.jpg",
    },
  ],
  bodyTreatments: [
    {
      id: 5,
      title: "Body Scrub",
      description: "A treatment that exfoliates and hydrates the skin.",
      image: "/images/body-scrub.jpg",
    },
    {
      id: 6,
      title: "Wrap Treatment",
      description: "A treatment that helps detoxify and hydrate the skin.",
      image: "/images/wrap-treatment.jpg",
    },
  ],
};

const TreatmentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTreatments = selectedCategory === 'all'
    ? Object.values(treatmentsData).flat()
    : treatmentsData[selectedCategory as keyof typeof treatmentsData];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="relative mb-12">
          <div className="absolute inset-0">
            <Image
              src="/images/treatments-hero.jpg" //TODO: Replace with hero image path
              alt="Spa Treatments"
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Treatments</h1>
            <p className="text-lg md:text-xl mb-6">
              Indulge in our luxurious treatments designed to rejuvenate your body and mind.
            </p>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Book Your Treatment
            </Button>
          </div>
        </section> 
        

        {/* Category Navigation */}
        <nav className="mb-8"> {/*TODO: Replace with mapping categories*/}
          <ul className="flex space-x-4">
            <li>
              <Button
                onClick={() => setSelectedCategory('all')}
                className={`${
                  selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                } px-4 py-2 rounded`}
              >
                All Treatments
              </Button>
            </li>
            {Object.keys(treatmentsData).map((category) => (
              <li key={category}>
                <Button
                  onClick={() => setSelectedCategory(category as keyof typeof treatmentsData)}
                  className={`${
                    selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                  } px-4 py-2 rounded`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Treatments Display */}
        <h2 className="text-3xl font-bold mb-6">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Treatments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment) => (
            <div key={treatment.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={treatment.image}
                alt={treatment.title}
                width={400}
                height={300}
                className="object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{treatment.title}</h3>
                <p className="text-gray-600">{treatment.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information Section */}
        <section className="py-16 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-6">Why Choose Our Treatments?</h2>
          <p className="text-lg text-center max-w-2xl mx-auto mb-8">
            Our treatments are designed to provide a holistic experience that not only relaxes the body but also rejuvenates the mind. Each treatment is tailored to meet your individual needs, ensuring you leave feeling refreshed and revitalized.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Learn More
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default TreatmentsPage;
