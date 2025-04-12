import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatmentBySlug, getTreatments, Treatment } from '@/lib/data/treatments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, PoundSterling, CheckCircle } from 'lucide-react';


type ResolvedParams = {
  categorySlug: string;
  treatmentSlug: string;
};

export default async function TreatmentDetailPage({ params }: { params: { categorySlug: string; treatmentSlug: string } }) {
  /* 
  This function is the main treatment detail page.
  It gets the treatment by slug and renders the treatment details.
  It also constructs the contact link with the treatment title / generates the static params for the treatment / notifies the user if the treatment is not found / renders the treatment details / constructs the contact link with the treatment title.

  @param params - The parameters for the treatment
  @returns A React component that renders the treatment details
  @throws Error if the treatment is not found / not valid 
  */

  const treatment: Treatment | undefined = getTreatmentBySlug(params.treatmentSlug);

  if (!treatment) {
    notFound();
  }

  // Construct the contact link
  const contactHref: string = `/contact?treatment=${encodeURIComponent(treatment.title)}`;

  return (
    <MainLayout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
              {treatment.image ? (
                <Image
                  src={treatment.image}
                  alt={treatment.title}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Image coming soon</span>
                </div>
              )}
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

              <div className="pt-4">
                <Link href={contactHref}>
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Book This Treatment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export async function generateStaticParams(): Promise<ResolvedParams[]> {
  /* 
  This function generates the static params for the treatment.
  It gets the treatments and returns the static params for the treatment.

  @returns An array of objects with the category slug and treatment slug
  @throws Error if the treatments are not found / not valid
  */
  const treatments: Treatment[] = getTreatments();

  return treatments.map((treatment) => ({
    categorySlug: treatment.category,
    treatmentSlug: treatment.slug,
  }));
}
