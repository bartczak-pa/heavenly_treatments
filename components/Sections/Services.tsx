'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TreatmentCategory } from '@/lib/data/treatments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';

interface ServicesSectionProps {
  categories: TreatmentCategory[];
  showAllButton?: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ categories, showAllButton = true }) => {
    const [showAll, setShowAll] = useState(!showAllButton);
    const totalCategories = categories.length;
    const initialVisibleCount = config.ui.INITIAL_VISIBLE_TREATMENTS;

    return (
        <section className="py-16 md:py-24 bg-primary/10">
            <div className="container mx-auto px-4">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-6">
                    Explore My Services
                </h2>
                <p className="font-sans text-lg text-foreground/80 text-center mb-12 max-w-xl mx-auto">
                    Indulge in treatments designed to soothe your body, rejuvenate your skin, and restore balance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/treatments/${category.slug}`}
                            className={cn(
                                'group block transition-all duration-300 ease-in-out hover:-translate-y-1',
                                showAllButton && index >= initialVisibleCount && !showAll ? 'hidden' : 'block',
                                'md:block'
                             )}
                        >
                             <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 group p-0 transition-all duration-300">
                                 <div className="relative w-full h-52 overflow-hidden">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
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
                    ))}
                </div>

                {showAllButton && !showAll && totalCategories > initialVisibleCount && (
                    <div className="text-center mt-12 md:hidden">
                        <Button onClick={(e) => { e.stopPropagation(); setShowAll(true); }} variant="outline" size="lg">
                            Show All Services ({totalCategories})
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