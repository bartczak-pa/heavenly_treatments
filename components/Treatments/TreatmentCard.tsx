'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Treatment, } from '@/lib/data/treatments';
import { Clock, PoundSterling } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreatmentCardProps {
  treatment: Treatment;
};

  
const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  return (
    <Link href={`/treatments/${treatment.category}/${treatment.slug}`} className="group block">
      
      <Card className={cn(
        "flex flex-col h-full overflow-hidden  hover:shadow-lg transition-all duration-300  pt-0",
      )}>
        <div className="relative w-full h-52 overflow-hidden">
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
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-serif text-xl font-medium text-primary group-hover:text-primary/80 truncate">
            {treatment.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-grow pb-4">
          <p className="font-sans text-sm text-muted-foreground line-clamp-3">
            {treatment.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {treatment.duration}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-primary/90">
            <PoundSterling className="h-4 w-4" />
            {treatment.price.replace('£', '')}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TreatmentCard; 