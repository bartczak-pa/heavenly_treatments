import React, { useMemo } from 'react';
import { getTreatments, getCategories, TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import CategoryFilters from '@/components/Treatments/categoryFilters';
import FilteredTreatmentsDisplay from '@/components/Treatments/FilteredTreatmentsDisplay';

export default function TreatmentsPage({ 
  searchParams 
}: { 
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allTreatments = getTreatments();
  const categories: TreatmentCategory[] = getCategories();

  const selectedCategorySlug = searchParams?.category as TreatmentCategorySlug | null;
  const currentSelection: TreatmentCategorySlug | 'all' = 
    selectedCategorySlug && categories.some(c => c.slug === selectedCategorySlug) 
      ? selectedCategorySlug 
      : 'all';

  const currentCategoryData: TreatmentCategory | null = useMemo(() => {
    if (currentSelection === 'all') {
      return null;
    }
    return categories.find(cat => cat.slug === currentSelection) || null;
  }, [currentSelection, categories]);

  const filteredTreatments = useMemo(() => {
    if (currentSelection === 'all') {
      return allTreatments;
    }
    return allTreatments.filter(treatment => treatment.category === currentSelection);
  }, [currentSelection, allTreatments]);

  return (
    <MainLayout>
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-8">
            {currentCategoryData ? currentCategoryData.name : 'All Treatments'}
          </h1>

          <CategoryFilters 
            selectedCategory={currentSelection}
          />

          {currentCategoryData && (
            <div className="text-center mb-12">
              <p className="font-sans text-lg text-muted-foreground max-w-xl mx-auto">
                {currentCategoryData.shortDescription || currentCategoryData.description}
              </p>
            </div>
          )}

          <FilteredTreatmentsDisplay 
            filteredTreatments={filteredTreatments}
            currentSelection={currentSelection}
          />
        </div>
      </section>
    </MainLayout>
  );
}
