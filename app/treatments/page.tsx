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
  /**
   * Treatments Page Component
   * 
   * A dynamic page component that displays treatments based on category filters.
   * 
   * Features:
   * - Displays all treatments or filtered by category
   * - Dynamic page title based on selected category
   * - Responsive grid layout for treatments
   * - Category filter navigation
   * - SEO-friendly with proper heading hierarchy
   * 
   * @component
   * @example
   * ```tsx
   * <TreatmentsPage params={params} searchParams={searchParams} />
   * ```
   * 
   * @param {Object} props - Component props
   * @param {Promise<Object>} props.params - Route parameters
   * @param {Promise<Object>} [props.searchParams] - URL search parameters
   * @returns {JSX.Element} A treatments page component
   */
  
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

          {/* Wrap CategoryFilters in a centering div */}
          <div className="flex justify-center mb-2 lg:mb-12">
            <CategoryFilters 
              selectedCategory={currentSelection}
            />
          </div>

          {currentCategoryData && (
            <div className="text-center mb-6 lg:mb-12">
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
