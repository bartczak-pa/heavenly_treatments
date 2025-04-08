'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';

const treatmentsData = {
  massages: [
    {
      id: '1',
      title: "Swedish Massage",
      slug: "swedish-massage",
      description: "A relaxing massage that uses long strokes and kneading.",
      image: "/images/swedish-massage.jpg",
    },
    {
      id: '2',
      title: "Deep Tissue Massage",
      slug: "deep-tissue-massage",
      description: "A therapeutic massage that targets deeper layers of muscle.",
      image: "/images/deep-tissue-massage.jpg",
    },
    {
      id: '7',
      title: "Hot Stone Massage",
      slug: "hot-stone-massage",
      description: "Soothing heat...",
      image: "/images/hot-stone-massage.jpg",
    },
    {
      id: '8',
      title: "Aromatherapy Massage",
      slug: "aromatherapy-massage",
      description: "Essential oils...",
      image: "/images/aromatherapy-massage.jpg",
    },
  ],
  facials: [
    {
      id: '3',
      title: "Hydrating Facial",
      slug: "hydrating-facial",
      description: "A facial designed to hydrate and nourish the skin.",
      image: "/images/hydrating-facial.jpg",
    },
    {
      id: '4',
      title: "Anti-Aging Facial",
      slug: "anti-aging-facial",
      description: "A facial that helps reduce the signs of aging.",
      image: "/images/anti-aging-facial.jpg",
    },
    {
      id: '9',
      title: "Brightening Facial",
      slug: "brightening-facial",
      description: "Glow boost...",
      image: "/images/brightening-facial.jpg",
    },
  ],
  bodyTreatments: [
    {
      id: '5',
      title: "Body Scrub",
      slug: "body-scrub",
      description: "A treatment that exfoliates and hydrates the skin.",
      image: "/images/body-scrub.jpg",
    },
    {
      id: '6',
      title: "Wrap Treatment",
      slug: "wrap-treatment",
      description: "A treatment that helps detoxify and hydrate the skin.",
      image: "/images/wrap-treatment.jpg",
    },
    {
      id: '10',
      title: "Mud Wrap",
      slug: "mud-wrap",
      description: "Purifying minerals...",
      image: "/images/mud-wrap.jpg",
    },
    {
      id: '11',
      title: "Seaweed Wrap",
      slug: "seaweed-wrap",
      description: "Rich nutrients...",
      image: "/images/seaweed-wrap.jpg",
    },
    {
      id: '12',
      title: "Salt Glow",
      slug: "salt-glow",
      description: "Invigorating polish...",
      image: "/images/salt-glow.jpg",
    },
  ],
};

const TreatmentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);
  const limits = { sm: 4, md: 4, lg: 6 };

  const filteredTreatments = useMemo(() => {
    return selectedCategory === 'all'
      ? Object.values(treatmentsData).flat()
      : treatmentsData[selectedCategory as keyof typeof treatmentsData] || [];
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowAll(false);
  };

  const shouldShowMoreButton = !showAll && filteredTreatments.length > limits.sm;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="relative mb-12 h-[40vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/treatments-hero.jpg"
              alt="Spa Treatments"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Treatments</h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Indulge in our luxurious treatments designed to rejuvenate your body and mind.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Book Your Treatment
            </Button>
          </div>
        </section> 
        

        {/* Category Navigation */}
        <nav className="mb-12">
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <Button
                onClick={() => handleCategoryChange('all')}
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`px-4 py-2 rounded ${selectedCategory === 'all' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Treatments
              </Button>
            </li>
            {Object.keys(treatmentsData).map((category) => (
              <li key={category}>
                <Button
                  onClick={() => handleCategoryChange(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Treatments Display */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          {selectedCategory === 'all' ? 'All Treatments' : selectedCategory.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ' Treatments'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment, index) => {
            const isVisibleSm = index < limits.sm;
            const isVisibleMd = index < limits.md;
            const isVisibleLg = index < limits.lg;

            let visibilityClasses = '';
            if (showAll) {
              visibilityClasses = 'block';
            } else {
              if (isVisibleLg) {
                if (isVisibleMd) {
                  if (isVisibleSm) {
                    visibilityClasses = 'block';
                  } else {
                    visibilityClasses = 'hidden md:block';
                  }
                } else {
                  visibilityClasses = 'hidden lg:block';
                }
              } else {
                visibilityClasses = 'hidden';
              }
            }

            if (!showAll) {
                if (index < limits.sm) {
                    visibilityClasses = 'block';
                } else if (index < limits.lg) {
                    visibilityClasses = 'hidden lg:block';
                } else {
                    visibilityClasses = 'hidden';
                }
            } else {
                visibilityClasses = 'block';
            }

            return (
              <Link
                href={`/treatments/${treatment.slug}`}
                key={treatment.id}
                className={`group bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg ${visibilityClasses}`}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={treatment.image}
                    alt={treatment.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{treatment.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{treatment.description}</p>
                  <span className="inline-block mt-2 text-blue-600 font-medium group-hover:underline">
                    View Details &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {shouldShowMoreButton && (
          <div className={`mt-8 text-center ${
               filteredTreatments.length <= limits.lg ? 'lg:hidden' : ''
          }`}>
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Show More ({filteredTreatments.length - limits.sm} more)
            </Button>
          </div>
        )}

        {/* Additional Information Section */}
        <section className="py-16 mt-16 bg-gray-50 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Treatments?</h2>
            <p className="text-lg max-w-3xl mx-auto mb-8 text-gray-700">
              Our treatments are designed to provide a holistic experience that not only relaxes the body but also rejuvenates the mind. Each treatment is tailored to meet your individual needs, ensuring you leave feeling refreshed and revitalized.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Book a Consultation
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default TreatmentsPage;
