'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { getTreatments, getCategories, Treatment, TreatmentCategory, TreatmentCategorySlug } from '@/lib/data/treatments';

// Fetch data directly since this is static data
const allTreatments: Treatment[] = getTreatments();
const categories: TreatmentCategory[] = getCategories();

export default function TreatmentsOverviewPage() {
  // State for the selected category filter
  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategorySlug | 'all'>('all');

  // Memoize filtered treatments to avoid recalculation on every render
  const filteredTreatments = useMemo(() => {
    if (selectedCategory === 'all') {
      return allTreatments;
    }
    return allTreatments.filter(treatment => treatment.category === selectedCategory);
  }, [selectedCategory]); // Recalculate only when selectedCategory changes

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as TreatmentCategorySlug | 'all');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">
          Our Treatments
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover a range of therapies designed to relax your body, rejuvenate your skin, and restore your sense of well-being.
        </p>

        {/* Category Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
           <span className="text-sm font-medium text-muted-foreground hidden sm:block">Filter by category:</span>
           {/* Desktop Buttons */}
           <div className="hidden sm:flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('all')}
              size="sm"
            >
              All Treatments
            </Button>
            {/* Use imported categories */}
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category.slug)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
           {/* Mobile Select Dropdown */}
           <div className="sm:hidden w-full max-w-xs">
             <Select value={selectedCategory} onValueChange={handleCategoryChange}>
               <SelectTrigger>
                 <SelectValue placeholder="Select a category" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Treatments</SelectItem>
                 {/* Use imported categories */}
                 {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
        </div>

        {/* Treatments Grid */}
        {filteredTreatments.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {/* Map over filtered treatments */}
             {filteredTreatments.map((treatment) => (
               <Card key={treatment.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                 <CardHeader className="p-0">
                   <div className="relative w-full h-48">
                     <Image
                       src={treatment.image}
                       alt={treatment.title}
                       fill
                       style={{ objectFit: 'cover' }}
                       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                     />
                   </div>
                 </CardHeader>
                 <CardContent className="flex-grow p-4">
                   <CardTitle className="text-xl mb-2">{treatment.title}</CardTitle>
                   <p className="text-sm text-muted-foreground line-clamp-3">
                     {treatment.description}
                   </p>
                 </CardContent>
                 <CardFooter className="p-4 flex justify-between items-center">
                   <div>
                     <span className="font-semibold">{treatment.price}</span>
                     <span className="text-xs text-muted-foreground ml-2">({treatment.duration})</span>
                   </div>
                   <Link href={`/treatments/${treatment.category}/${treatment.slug}`} passHref legacyBehavior>
                     <Button variant="outline" size="sm">
                       View Details
                     </Button>
                   </Link>
                 </CardFooter>
               </Card>
             ))}
           </div>
         ) : (
           <p className="text-center text-muted-foreground mt-8">
             No treatments found for the selected category.
           </p>
         )}
      </div>
    </MainLayout>
  );
}
