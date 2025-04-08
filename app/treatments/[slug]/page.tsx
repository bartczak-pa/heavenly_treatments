'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';

const treatmentsData = {
  massages: [
    {
      id: '1',
      title: "Swedish Massage",
      slug: "swedish-massage",
      description: "A relaxing massage that uses long strokes and kneading to improve circulation and ease muscle tension.",
      image: "/images/swedish-massage.jpg",
      duration: "60 minutes",
      price: "£50",
      keyFeatures: [
        "Reduces muscle tension and stress",
        "Improves blood circulation",
        "Promotes relaxation and well-being",
        "Uses gentle to moderate pressure"
      ]
    },
    {
      id: '2',
      title: "Deep Tissue Massage",
      slug: "deep-tissue-massage",
      description: "A therapeutic massage targeting deeper layers of muscle and connective tissue, ideal for chronic aches and pains.",
      image: "/images/deep-tissue-massage.jpg",
      duration: "60 minutes",
      price: "£60",
      keyFeatures: [
        "Relieves chronic muscle pain",
        "Breaks down scar tissue",
        "Improves range of motion",
        "Uses firm pressure and slow strokes"
      ]
    },
  ],
  facials: [
    {
      id: '3',
      title: "Hydrating Facial",
      slug: "hydrating-facial",
      description: "A facial treatment designed to deeply hydrate and nourish the skin, leaving it soft and supple.",
      image: "/images/hydrating-facial.jpg",
      duration: "45 minutes",
      price: "£40",
      keyFeatures: [
        "Intensely moisturizes dry skin",
        "Restores skin's natural barrier",
        "Leaves skin feeling smooth and refreshed",
        "Suitable for all skin types, especially dry"
      ]
    },
    {
      id: '4',
      title: "Anti-Aging Facial",
      slug: "anti-aging-facial",
      description: "A specialized facial that helps reduce the visible signs of aging, such as fine lines and wrinkles.",
      image: "/images/anti-aging-facial.jpg",
      duration: "60 minutes",
      price: "£55",
      keyFeatures: [
        "Targets fine lines and wrinkles",
        "Improves skin elasticity and firmness",
        "Promotes a youthful glow",
        "Uses collagen-boosting ingredients"
      ]
    },
  ],
  bodyTreatments: [
    {
      id: '5',
      title: "Body Scrub",
      slug: "body-scrub",
      description: "An exfoliating treatment that removes dead skin cells, leaving the skin smooth, soft, and radiant.",
      image: "/images/body-scrub.jpg",
      duration: "30 minutes",
      price: "£30",
      keyFeatures: [
        "Exfoliates dead skin cells",
        "Improves skin texture and tone",
        "Stimulates circulation",
        "Leaves skin soft and glowing"
      ]
    },
    {
      id: '6',
      title: "Wrap Treatment",
      slug: "wrap-treatment",
      description: "A detoxifying and hydrating treatment where the body is wrapped in nourishing ingredients.",
      image: "/images/wrap-treatment.jpg",
      duration: "45 minutes",
      price: "£45",
      keyFeatures: [
        "Helps detoxify the body",
        "Deeply hydrates and conditions the skin",
        "Promotes relaxation",
        "Can improve skin firmness"
      ]
    },
  ],
};

const TreatmentDetailPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const treatment = Object.values(treatmentsData)
    .flat()
    .find((treatment) => treatment.slug === slug);

  if (!treatment) {
    return <div>Treatment not found</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={treatment.image}
              alt={treatment.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{treatment.title}</h1>
            <p className="text-lg text-gray-700 mb-6">{treatment.description}</p>
            <div className="space-y-2 mb-6">
              <p className="text-md font-semibold">
                <span className="text-gray-500 mr-2">Duration:</span>
                {treatment.duration}
              </p>
              <p className="text-md font-semibold">
                <span className="text-gray-500 mr-2">Price:</span>
                {treatment.price}
              </p>
            </div>
            {treatment.keyFeatures && treatment.keyFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {treatment.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
             <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto">
               Book This Treatment
             </Button>
          </div>
        </section>

        <section className="py-8 border-t">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What to Expect</h2>
          <div className="prose max-w-none">
            <p>
              During your {treatment.title}, you will experience a personalized approach tailored to your specific needs and preferences. Our skilled therapists use high-quality products and techniques to ensure you feel relaxed, comfortable, and rejuvenated throughout the session.
            </p>
            <p>
              We recommend arriving a few minutes early to settle in and discuss any specific concerns or areas you&apos;d like to focus on with your therapist.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default TreatmentDetailPage;
