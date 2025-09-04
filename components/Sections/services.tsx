'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { treatmentCategories } from '@/lib/data/treatments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Constants
const INITIAL_VISIBLE_COUNT = 3;
const SECTION_HEADING = "Explore My Services";
const SECTION_DESCRIPTION = "Indulge in treatments designed to soothe your body, rejuvenate your skin, and restore balance.";
const GRID_BREAKPOINTS = {
  sm: 'sm:grid-cols-2',
  lg: 'lg:grid-cols-3'
} as const;

interface ServicesSectionProps {
  showAllButton?: boolean;
  initialVisibleCount?: number;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  showAllButton = true, 
  initialVisibleCount = INITIAL_VISIBLE_COUNT
}) => {
    const [showAll, setShowAll] = useState(!showAllButton);
    const totalCategories = treatmentCategories.length;
    
    
    // Helper function to determine item visibility
    const getItemVisibility = (index: number): string => {
      if (!showAllButton) return 'block';
      if (showAll) return 'block';
      if (index < initialVisibleCount) return 'block';
      return 'hidden md:block';
    };

    return (
        <section className="py-16 md:py-24 bg-primary/10">
            <div className="container mx-auto px-4">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-4">
                    {SECTION_HEADING}
                </h2>
                <p className="font-sans text-lg text-foreground/80 text-center mb-12 max-w-xl mx-auto">
                    {SECTION_DESCRIPTION}
                </p>

                <div 
                    className={cn(
                        'grid grid-cols-1 gap-8',
                        GRID_BREAKPOINTS.sm,
                        GRID_BREAKPOINTS.lg
                    )}
                    role="grid"
                    aria-label="Treatment categories"
                >
                    {treatmentCategories.map((category, index) => {
                        const shouldPriorityLoad = index < initialVisibleCount;
                        
                        return (
                            <Link
                                key={category.id}
                                href={`/treatments?category=${category.slug}`}
                                className={cn(
                                    'group block transition-all duration-300 ease-in-out hover:-translate-y-1',
                                    getItemVisibility(index)
                                )}
                                role="gridcell"
                                aria-label={`View ${category.name} treatments`}
                            >
                                <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl group p-0">
                                    <div 
                                        className="relative w-full h-52 overflow-hidden bg-secondary/10"
                                    >
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={`${category.name} treatment category`}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                priority={shouldPriorityLoad}
                                                loading={shouldPriorityLoad ? 'eager' : 'lazy'}
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full bg-secondary/20 flex items-center justify-center"
                                                role="img"
                                                aria-label="Placeholder for upcoming image"
                                            >
                                                <span className="text-muted-foreground text-sm">Image coming soon</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <h3 className="font-serif text-xl font-medium text-primary group-hover:text-primary/80">
                                            {category.name}
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="font-sans text-sm text-foreground/80 line-clamp-3">
                                            {category.shortDescription || category.description || 'Discover relaxing treatments.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {showAllButton && !showAll && totalCategories > initialVisibleCount && (
                    <div className="text-center mt-12 md:hidden">
                        <Button 
                            onClick={() => setShowAll(true)}
                            variant="outline" 
                            size="lg"
                            aria-expanded="false"
                            aria-controls="services-grid"
                            aria-describedby="services-count"
                        >
                            Show All Services
                            <span id="services-count" className="ml-1">({totalCategories})</span>
                        </Button>
                    </div>
                )}
                 <div className="text-center mt-12">
                      <Button variant="default" size="lg" asChild>
                         <Link href="/treatments">View All Treatments</Link>
                      </Button>
                 </div>
            </div>
        </section>
    );
};

export default ServicesSection;