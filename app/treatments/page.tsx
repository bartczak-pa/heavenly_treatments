import React from 'react';
import { getTreatments, getCategories, TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';
import { MainLayout } from '@/components/Layout/MainLayout';
import CategoryFilters from '@/components/Treatments/categoryFilters';
import FilteredTreatmentsDisplay from '@/components/Treatments/FilteredTreatmentsDisplay';

type Props = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};


export default async function TreatmentsPage(props: Props) { 
  
  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;

  
  // eslint-disable-next-line no-unused-vars
  const _params = awaitedParams; // Assign awaited params to unused variable

  const allTreatments = getTreatments();
  const categories: TreatmentCategory[] = getCategories();

  
  const selectedCategorySlug = awaitedSearchParams?.category as TreatmentCategorySlug | null;
  const currentSelection: TreatmentCategorySlug | 'all' = 
    selectedCategorySlug && categories.some(c => c.slug === selectedCategorySlug) 
      ? selectedCategorySlug 
      : 'all';

  
  const currentCategoryData: TreatmentCategory | null = 
    currentSelection === 'all' 
      ? null 
      : categories.find(cat => cat.slug === currentSelection) || null;

  
  const filteredTreatments = 
    currentSelection === 'all'
      ? allTreatments
      : allTreatments.filter(treatment => treatment.category === currentSelection);

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
