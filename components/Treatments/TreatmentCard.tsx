'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Treatment, } from '@/lib/data/treatments';
import { Clock, PoundSterling } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreatmentCardProps {
  treatment: Treatment;
};

/**
 * TreatmentCard Component
 * 
 * A card component that displays treatment information including:
 * - Treatment image
 * - Title
 * - Description
 * - Duration
 * - Price
 * 
 * Features:
 * - Responsive image handling with fallback
 * - Hover effects for better user interaction
 * - Links to both treatment details and contact page
 * - Accessible design with proper semantic HTML
 * 
 * @component
 * @example
 * ```tsx
 * <TreatmentCard treatment={treatmentData} />
 * ```
 * 
 * @param {Treatment} treatment - The treatment data to display
 * @returns {JSX.Element} A treatment card component
 */
const TreatmentCard = memo<TreatmentCardProps>(({ treatment }) => {
  const contactHref: string = `/contact?treatment=${encodeURIComponent(treatment.title)}`;
  const detailHref: string = `/treatments/${treatment.category}/${treatment.slug}`;

  return (
    <Card className={cn(
      "flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group",
      "pt-0 pb-4"
    )}>
      <Link href={detailHref} className="block relative w-full h-52 overflow-hidden">
        {treatment.image ? (
          <Image
            src={treatment.image}
            alt={treatment.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image coming soon</span>
          </div>
        )}
      </Link>
      
      <Link href={detailHref} className="block flex-grow">
        <CardHeader className="pb-2 pt-4">
          <h3 className="font-serif text-xl font-medium text-primary group-hover:text-primary/80">
            {treatment.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="font-sans text-sm text-muted-foreground line-clamp-4">
            {treatment.description}
          </p>
        </CardContent>
      </Link>

      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3 mt-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {treatment.duration}
          </span>
          <span className="flex items-center gap-0.5 font-medium text-primary/90">
            <PoundSterling className="h-4 w-4" />
            {treatment.price.replace('£', '')}
          </span>
        </div>
        <Link href={contactHref}>
          <Button variant="secondary" size="sm">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
});

TreatmentCard.displayName = 'TreatmentCard';

export default TreatmentCard; 