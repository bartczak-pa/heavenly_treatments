import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/UI/button';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatmentBySlug, getTreatments } from '@/lib/data/treatments';
import { notFound } from 'next/navigation';

type ResolvedParams = {
  categorySlug: string;
  treatmentSlug: string;
};


const TreatmentDetailPage = async ({ params: paramsPromise }: { params: Promise<ResolvedParams> }) => {

  const params = await paramsPromise;
  const { categorySlug, treatmentSlug } = params;

  const treatment = getTreatmentBySlug(treatmentSlug);

  if (!treatment || treatment.category !== categorySlug) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={treatment.image}
              alt={treatment.title}
              fill
              style={{ objectFit: 'cover' }}
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

// generateStaticParams still returns the resolved params objects
export async function generateStaticParams(): Promise<ResolvedParams[]> {
  const treatments = getTreatments();

  return treatments.map((treatment) => ({
    categorySlug: treatment.category,
    treatmentSlug: treatment.slug,
  }));
}
