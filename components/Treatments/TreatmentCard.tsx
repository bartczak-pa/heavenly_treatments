/**
 * @fileoverview Treatment card component for displaying individual treatments
 * 
 * Optimized card component with hover effects, responsive design, and multiple
 * navigation paths (details and booking). Includes performance optimizations
 * with React.memo and optimized images.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { BookingButton } from '@/components/BookingButton';
import { Treatment } from '@/lib/data/treatments';
import { Clock, PoundSterling } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for the TreatmentCard component
 */
interface TreatmentCardProps {
  /** Treatment data object containing all display information */
  treatment: Treatment;
};

/**
 * Treatment card component with optimized performance and UX
 * 
 * Displays treatment information in a responsive card layout with:
 * - Optimized images with lazy loading and responsive sizes
 * - Hover effects and smooth transitions
 * - Multiple navigation paths (details view and booking)
 * - Accessible design with semantic HTML structure
 * - Performance optimization with React.memo
 * 
 * The card layout includes:
 * - Hero image with hover scale effect
 * - Treatment title, description, duration, and price
 * - Book Now button with direct contact link
 * 
 * @param props - Component props
 * @returns JSX element representing a treatment card
 * 
 * @example
 * ```typescript
 * <TreatmentCard treatment={treatmentData} />
 * ```
 */
const TreatmentCard = memo<TreatmentCardProps>(({ treatment }) => {
  const detailHref: string = `/treatments/${treatment.category}/${treatment.slug}`;

  return (
    <Card className={cn(
      "flex flex-col h-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group",
      "pt-0 pb-4"
    )}>
      <Link href={detailHref} className="block relative w-full h-52 overflow-hidden">
        {treatment.image ? (
          <OptimizedImage
            src={treatment.image}
            alt={treatment.title}
            fill
            aspectRatio="4/3"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
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
            <PoundSterling className="h-4 w-4" aria-hidden="true" />
            {treatment.price.replace('£', '')}
          </span>
        </div>
        <BookingButton
          context="treatment-card"
          treatmentTitle={treatment.title}
          freshaUrl={treatment.freshaUrl}
          variant="secondary"
          size="sm"
        >
          Book Now
        </BookingButton>
      </CardFooter>
    </Card>
  );
});

TreatmentCard.displayName = 'TreatmentCard';

export default TreatmentCard; 