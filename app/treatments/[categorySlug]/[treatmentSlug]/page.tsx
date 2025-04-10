import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatmentBySlug, getTreatments } from '@/lib/data/treatments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, PoundSterling, CheckCircle } from 'lucide-react';

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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src={treatment.image}
                alt={treatment.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary">
                {treatment.title}
              </h1>
              <p className="font-sans text-lg text-muted-foreground">
                {treatment.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <span className="flex items-center gap-1.5 text-lg font-medium text-primary/90">
                  <PoundSterling className="h-5 w-5" /> 
                  {treatment.price.replace('£', '')}
                </span>
                <span className="flex items-center gap-1.5 text-base">
                  <Clock className="h-4 w-4" /> 
                  {treatment.duration}
                </span>
              </div>

              {treatment.keyFeatures && treatment.keyFeatures.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold text-primary mb-3">Key Features</h2>
                  <ul className="space-y-2">
                    {treatment.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 font-sans text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button size="lg" asChild variant="default">
                 <Link href="/#calendly-embed">
                   Book This Treatment
                 </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TreatmentDetailPage;

export async function generateStaticParams(): Promise<ResolvedParams[]> {
  const treatments = getTreatments();

  return treatments.map((treatment) => ({
    categorySlug: treatment.category,
    treatmentSlug: treatment.slug,
  }));
}
