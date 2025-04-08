'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { getTreatmentBySlug } from '@/lib/data/treatments';

interface PageProps {
  params: {
    slug: string;
  };
}

const TreatmentDetailPage = ({ params }: PageProps) => {
  const { slug } = params;

  const treatment = getTreatmentBySlug(slug);

  if (!treatment) {
    return <div>Treatment not found</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={treatment.image}
              alt={treatment.title}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {treatment.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {treatment.description}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-lg font-semibold">{treatment.price}</span>
              <span className="text-sm text-muted-foreground">({treatment.duration})</span>
            </div>

            {treatment.keyFeatures && treatment.keyFeatures.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Key Features:</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {treatment.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button size="lg" className="w-full md:w-auto">
              Book This Treatment
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TreatmentDetailPage;
