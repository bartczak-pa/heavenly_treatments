'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { treatmentCategories } from '@/lib/data/treatments';
import { Button } from '@/components/UI/button';

const ServicesSection = () => {
    const [showAll, setShowAll] = useState(false);
    const totalCategories = treatmentCategories.length;
    const initialVisibleCount = 3;

    return (
        <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">My Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {treatmentCategories.map((category, index) => (
              <div
                key={category.id}
                className={`
                  ${index >= initialVisibleCount && !showAll ? 'hidden' : 'block'}
                  md:block
                  group relative overflow-hidden rounded-lg shadow-lg cursor-pointer
                `}
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-60 md:h-72 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-60 md:h-72 bg-muted flex items-center justify-center">
                     <span className="text-muted-foreground">Image coming soon</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                  <div className="p-4 md:p-6 w-full">
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-gray-200 text-sm line-clamp-2">
                        {category.shortDescription || category.description || 'More details coming soon.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAll && totalCategories > initialVisibleCount && (
            <div className="text-center mt-10 md:hidden">
              <Button onClick={() => setShowAll(true)} variant="outline" size="lg">
                Show All Services ({totalCategories})
              </Button>
            </div>
          )}
        </div>
      </section>
    );
};

export default ServicesSection;