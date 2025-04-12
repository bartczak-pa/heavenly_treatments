'use client';

import React from 'react';
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

  
const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  /* 
  This component is the main treatment card component.
  It renders the treatment card with the treatment details.
  It also constructs the contact link with the treatment title / constructs the detail link with the treatment category and slug.
  It also uses the `cn` utility function to merge the default styles with the treatment card styles / renders the treatment card with the treatment details.
  
  @param treatment - The treatment to render
  @returns A React component that renders the treatment card with the treatment details
  @throws Error if the treatment is not found / not valid
  */

  const contactHref: string = `/contact?treatment=${encodeURIComponent(treatment.title)}`;
  const detailHref: string = `/treatments/${treatment.category}/${treatment.slug}`;

  return (
    <Card className={cn(
      "flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group",
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
        <CardHeader className="pb-2">
          <h3 className="font-serif text-xl font-medium text-primary group-hover:text-primary/80 truncate">
            {treatment.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="font-sans text-sm text-muted-foreground line-clamp-3">
            {treatment.description}
          </p>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground border-t pt-4 gap-4">
        <div className="flex justify-between w-full sm:w-auto gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {treatment.duration}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-primary/90">
              <PoundSterling className="h-4 w-4" />
              {treatment.price.replace('£', '')}
            </span>
        </div>
        <Link href={contactHref} className="w-full sm:w-auto">
          <Button variant="secondary" size="sm" className="w-full">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TreatmentCard; 