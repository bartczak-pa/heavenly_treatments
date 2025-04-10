'use client';

import React, { useState, useMemo } from 'react';
import { getTreatments, getCategories, TreatmentCategorySlug } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import CategoryFilters from '@/components/Treatments/categoryFilters';
import TreatmentsGrid from '@/components/Treatments/treatmentsGrid';

const TreatmentsPage = () => {
  const allTreatments = getTreatments();
  const categories = getCategories();
  const initialVisibleCount = 6;

  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategorySlug | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const currentCategoryData = useMemo(() => {
    if (selectedCategory === 'all') {
      return null;
    }
    return categories.find(cat => cat.slug === selectedCategory);
  }, [selectedCategory, categories]);

  const filteredTreatments = useMemo(() => {
    if (selectedCategory === 'all') {
      return allTreatments;
    }
    return allTreatments.filter(treatment => treatment.category === selectedCategory);
  }, [selectedCategory, allTreatments]);

  const treatmentsToShow = filteredTreatments.slice(0, visibleCount);
  const hasMoreTreatments = filteredTreatments.length > visibleCount;

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug as TreatmentCategorySlug | 'all');
    setVisibleCount(initialVisibleCount);
  };

  return (
    <MainLayout>
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-8">
            {currentCategoryData ? currentCategoryData.name : 'All Treatments'}
          </h1>

          <CategoryFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange} 
          />

          {currentCategoryData && (
            <div className="text-center mb-12">
              <p className="font-sans text-lg text-muted-foreground max-w-xl mx-auto">
                {currentCategoryData.shortDescription || currentCategoryData.description}
              </p>
            </div>
          )}

          {treatmentsToShow.length > 0 ? (
            <TreatmentsGrid 
              treatments={treatmentsToShow}  
            />
          ) : (
            <p className="text-center text-muted-foreground mt-8">
              No treatments found for the selected category.
            </p>
          )}

          {hasMoreTreatments && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => setVisibleCount(filteredTreatments.length)}
                variant="outline"
                size="lg"
              >
                Show All {selectedCategory !== 'all' ? currentCategoryData?.name : ''} Treatments ({filteredTreatments.length})
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default TreatmentsPage;
