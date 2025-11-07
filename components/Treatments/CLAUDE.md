# components/Treatments/ - Treatment Display Components

Components for displaying, filtering, and managing treatment information.

## Components

### TreatmentsGrid.tsx

Main container component displaying treatments in a grid layout.

**Props**:
```typescript
interface TreatmentsGridProps {
  treatments: Treatment[];
  loading?: boolean;
  error?: string;
  onCategoryChange?: (category: string) => void;
}
```

**Features**:
- Responsive grid (1-3 columns based on screen size)
- Handles loading and error states
- Category filtering support
- Lazy loads images
- Empty state handling

**Usage**:
```typescript
import { TreatmentsGrid } from '@/components/Treatments/TreatmentsGrid';

export default async function TreatmentsPage() {
  const treatments = await fetchTreatments();
  return <TreatmentsGrid treatments={treatments} />;
}
```

**Responsive Layout**:
- Mobile (< 640px): 1 column
- Tablet (640px - 1024px): 2 columns
- Desktop (> 1024px): 3 columns

### TreatmentCard.tsx

Individual treatment card component.

**Props**:
```typescript
interface TreatmentCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image?: {
    src: string;
    alt: string;
  };
  benefits?: string[];
  onClick?: () => void;
}
```

**Displays**:
- Treatment image (optimized)
- Title and category
- Short description (truncated)
- Price and duration
- Benefits list (optional)
- "Learn More" or "Book Now" button

**Features**:
- Hover effects (scale, shadow)
- Loading skeleton placeholder
- Link to treatment detail page
- Rating display (if applicable)

**Usage**:
```typescript
<TreatmentCard
  id={treatment._id}
  title={treatment.title}
  description={treatment.description}
  price={treatment.price}
  duration={treatment.duration}
  image={{
    src: treatment.imageUrl,
    alt: treatment.title,
  }}
  benefits={treatment.benefits}
/>
```

**Styling**:
- Card shadow and rounded corners
- Smooth transitions on hover
- Responsive padding
- Image aspect ratio maintained

### FilteredTreatmentsDisplay.tsx

Display filtered treatment results with filter state.

**Props**:
```typescript
interface FilteredTreatmentsDisplayProps {
  treatments: Treatment[];
  selectedCategory?: string;
  isLoading?: boolean;
}
```

**Features**:
- Shows total treatment count
- Displays active filter
- Loading skeleton states
- Empty state message
- Responsive grid display

**Usage**:
```typescript
<FilteredTreatmentsDisplay
  treatments={filteredTreatments}
  selectedCategory={category}
  isLoading={loading}
/>
```

**Behavior**:
- Shows "X treatments found" message
- Indicates active category filter
- Shows skeleton cards while loading
- Empty message if no results match

### CategoryFilters.tsx

Filter UI component for treatment categories.

**Props**:
```typescript
interface CategoryFiltersProps {
  categories: TreatmentCategory[];
  selectedCategory?: string;
  onCategoryChange: (slug: string | null) => void;
  loading?: boolean;
}
```

**Features**:
- Category buttons with counts
- Active state highlighting
- "All Treatments" option
- Mobile-friendly layout
- Disabled state while loading

**Usage**:
```typescript
'use client';

import { CategoryFilters } from '@/components/Treatments/CategoryFilters';
import { useState } from 'react';

export function TreatmentsPage({ categories }) {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <CategoryFilters
      categories={categories}
      selectedCategory={selected}
      onCategoryChange={setSelected}
    />
  );
}
```

**Responsive**:
- Desktop: Vertical sidebar or horizontal top bar
- Mobile: Horizontal scrollable list

**Display**:
- Category name
- Treatment count (optional)
- Active indicator
- Hover effects

## Data Flow

```
Server Component (fetch data)
    ↓
Pass treatments + categories to client component
    ↓
Client state for selected category
    ↓
Filter treatments client-side or fetch filtered data
    ↓
Update display with CategoryFilters + FilteredTreatmentsDisplay
```

## Type Definitions

```typescript
interface Treatment {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  price: number;
  duration: string;
  benefits: string[];
  image?: SanityImage;
  category?: TreatmentCategory;
}

interface TreatmentCategory {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
}

interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
}
```

## Styling

All components use:
- TailwindCSS for layout and spacing
- shadcn/ui Button components
- OptimizedImage for images
- CVA for card variants

**Cards**:
```typescript
className="rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white p-4"
```

**Grid**:
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

## Common Patterns

### Client-Side Filtering
```typescript
'use client';

export function TreatmentsWithFilters() {
  const [selected, setSelected] = useState<string | null>(null);
  
  const filtered = selected
    ? treatments.filter(t => t.category?.slug === selected)
    : treatments;
  
  return (
    <>
      <CategoryFilters {...} onChange={setSelected} />
      <FilteredTreatmentsDisplay treatments={filtered} />
    </>
  );
}
```

### Server-Side Filtering (with dynamic routes)
```typescript
export default async function CategoryPage({
  params: { categorySlug }
}: {
  params: { categorySlug: string }
}) {
  const treatments = await fetchTreatmentsByCategory(categorySlug);
  return <TreatmentsGrid treatments={treatments} />;
}
```

## Image Optimization

All TreatmentCard images:
- Use OptimizedImage component
- Lazy load by default
- Maintain aspect ratio
- Built-in error boundary

```typescript
<OptimizedImage
  src={imageUrl}
  alt={treatment.title}
  width={400}
  height={300}
  priority={isPriority}
/>
```

## Loading & Error States

```typescript
// Loading skeleton
<div className="bg-gray-200 animate-pulse h-48 rounded" />

// Error boundary
<ErrorBoundary fallback={<div>Failed to load treatments</div>}>
  <TreatmentsGrid {...} />
</ErrorBoundary>
```

## Common Tasks

### Update Card Layout
1. Open `TreatmentCard.tsx`
2. Modify card structure/styling
3. Adjust image sizes
4. Update hover effects
5. Test on all breakpoints

### Add New Filter Type
1. Update TreatmentCategory interface
2. Modify CategoryFilters props
3. Update filter button logic
4. Test filtering functionality

### Change Grid Columns
1. Open `TreatmentsGrid.tsx`
2. Update `grid-cols-*` classes
3. Adjust gap spacing
4. Test responsive behavior

## Testing

```typescript
describe('TreatmentCard', () => {
  it('displays treatment information', () => {
    render(<TreatmentCard {...mockTreatment} />);
    expect(screen.getByText(mockTreatment.title)).toBeInTheDocument();
    expect(screen.getByText(`£${mockTreatment.price}`)).toBeInTheDocument();
  });

  it('links to treatment detail page', () => {
    render(<TreatmentCard {...mockTreatment} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/treatments/${mockTreatment.slug}`);
  });
});

describe('CategoryFilters', () => {
  it('filters treatments on category click', () => {
    const onChange = vi.fn();
    render(<CategoryFilters {...mockProps} onCategoryChange={onChange} />);
    
    const massageButton = screen.getByRole('button', { name: /massage/i });
    fireEvent.click(massageButton);
    
    expect(onChange).toHaveBeenCalledWith('massage');
  });
});
```

## Integration Points

- Fetches data via `lib/cms/treatments`
- Displays Sanity Treatment and TreatmentCategory types
- Links to dynamic treatment detail pages
- Uses environment variables for Calendly
- Integrates with Filter component for user interaction
