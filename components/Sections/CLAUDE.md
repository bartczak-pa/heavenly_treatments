# components/Sections/ - Page Section Components

Large, reusable full-width page sections that can be composed on any page.

## Pattern

Sections are:
- Full-width components (handle own spacing/padding)
- Composed of smaller components
- Fetch their own data (server components)
- Display discrete content blocks
- Reusable across multiple pages

**Structure**:
```typescript
// Server component - fetches data
export async function Services() {
  const treatments = await fetchTreatments();
  return <ServicesContent treatments={treatments} />;
}

// Client component - displays content
function ServicesContent({ treatments }) {
  return (
    <section className="py-16 md:py-24 bg-white">
      {/* Content */}
    </section>
  );
}
```

## Components Overview

| Component | Purpose | Page Usage |
|-----------|---------|-----------|
| **MainHeader** | Hero banner with title, subtitle, image | Home, About, etc. |
| **Introduction** | Intro text about business | Home |
| **Experience** | Benefits/experience section | Home |
| **Services** | Featured treatments showcase | Home |
| **MeetTherapist** | About therapist bio section | About |
| **MyStudio** | Studio photos/tour | About |
| **Testimonials** | Client reviews and ratings | Home, About |
| **LocationAndBooking** | Map + CTA + location info | Contact |
| **Cta** | Call-to-action section | Various |
| **ContactInfo** | Contact details + hours | Contact |

## Major Components

### MainHeader.tsx

Hero section with image and headline.

**Props**:
```typescript
interface MainHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: {
    text: string;
    href: string;
  };
  height?: 'small' | 'medium' | 'large';
}
```

**Usage**:
```typescript
<MainHeader
  title="Professional Spa Treatments"
  subtitle="Relax and rejuvenate in our peaceful studio"
  backgroundImage={imageUrl}
  height="large"
/>
```

**Features**:
- Full-width hero with background image
- Text overlay with semi-transparent bg
- Responsive text sizing
- Optional CTA button
- Parallax effect (optional)
- Optimized image loading

### Testimonials.tsx

Client testimonials showcase with ratings.

**Fetches From**:
- Sanity CMS `testimonial` documents
- Fallback to `DEFAULT_TESTIMONIALS` from `lib/data/`

**Features**:
- Grid or carousel layout
- Star ratings display
- Author name and title
- Profile image (optional)
- Responsive columns
- Loading skeleton

**Usage**:
```typescript
// Server component
export async function Testimonials() {
  const testimonials = await fetchTestimonials();
  return <TestimonialsContent testimonials={testimonials} />;
}
```

**Filtering**:
- Can show specific number (e.g., 3 featured)
- Can filter by minimum rating
- Responsive grid (1-3 columns)

### Services.tsx

Featured treatments showcase.

**Fetches From**:
- `fetchTreatments()` from `lib/cms/treatments`
- Limits to featured or top X treatments

**Features**:
- Treatment cards in grid
- Price and duration display
- "Learn More" links
- "Book Now" buttons
- Responsive layout
- Loading states

**Usage**:
```typescript
<Services />
// Automatically fetches and displays featured treatments
```

### MeetTherapist.tsx

About therapist section.

**Content**:
- Therapist photo (large, optimized)
- Name and title
- Qualifications and certifications
- Professional philosophy
- Experience summary
- Languages offered

**Fetches From**:
- Sanity CMS (therapist profile)
- Fallback text in component

**Layout**:
- Mobile: Stacked (image, text)
- Desktop: Side-by-side layout

### MyStudio.tsx

Studio photos and environment showcase.

**Features**:
- Photo gallery/grid
- Ambient/peaceful imagery
- Responsive image grid
- Lazy loading
- Lightbox or modal (optional)

**Fetches From**:
- Sanity CMS (studio images collection)
- Static images from public/

### Testimonials.tsx (Client Reviews)

High-impact social proof section.

**Features**:
- Star ratings (1-5)
- Author quotes
- Author photos (optional)
- Review count or highlighted reviews
- Rotate/cycle through testimonials
- Loading skeleton states

**Responsive**:
- Mobile: 1 testimonial at a time
- Tablet: 2 testimonials
- Desktop: 3 testimonials

### LocationAndBooking.tsx

Location map + contact info + booking CTA.

**Components**:
- Embedded Google Map
- Address details
- Phone and email
- Business hours
- "Book Now" button
- Directions link

**Usage**:
```typescript
<LocationAndBooking />
```

### Cta.tsx

Call-to-action section (flexible).

**Props**:
```typescript
interface CtaProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  backgroundColor?: string;
  textColor?: string;
}
```

**Usage**:
```typescript
<Cta
  title="Ready to relax?"
  description="Book your treatment today"
  buttonText="Book Now"
  buttonHref={CALENDLY_URL}
/>
```

## Data Flow Pattern

### Server Component (Fetches Data)
```typescript
// Server component
export async function Testimonials() {
  try {
    const testimonials = await fetchTestimonials();
    return <TestimonialsContent testimonials={testimonials} />;
  } catch (error) {
    // Fallback to default data
    return <TestimonialsContent testimonials={DEFAULT_TESTIMONIALS} />;
  }
}
```

### Client Component (Displays)
```typescript
// Client component
function TestimonialsContent({ 
  testimonials 
}: { 
  testimonials: Testimonial[] 
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <TestimonialCard key={t._id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Styling Standards

### Section Container
```typescript
<section className="py-12 md:py-16 lg:py-24 px-4 md:px-6">
  <div className="max-w-6xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Headings
```typescript
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8">
  Section Title
</h2>
```

### Responsive Grid
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

## NewHome/ Subdirectory

Contains variant/alternative components for new home page design:
- `HeroSection.tsx` - New hero style
- `FeaturesSection.tsx` - Feature showcase
- Alternative layouts for existing sections

Use when redesigning or A/B testing layouts.

## Common Tasks

### Add New Section
1. Create file in `components/Sections/[SectionName].tsx`
2. Create server component that fetches data
3. Create client component for display
4. Import on page that needs section
5. Add spacing/styling to match design
6. Test responsive layout

### Update Section Data
1. Modify Sanity fetch if content-based
2. Or update default data in `lib/data/`
3. Adjust component to display new fields
4. Test loading and empty states

### Change Section Styling
1. Open section component
2. Modify TailwindCSS classes
3. Test on mobile/tablet/desktop
4. Ensure responsive breakpoints work
5. Check image sizing

### Reorder Sections on Page
1. Import sections in desired order
2. Update page layout
3. Test spacing between sections
4. Verify color/styling flow

## Image Handling

All section images:
- Use `OptimizedImage` component
- Lazy load by default
- Responsive sizing
- WebP/AVIF formats

```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  priority={isPriority} // Only for above-fold
/>
```

## Error Handling

Sections should gracefully handle errors:

```typescript
export async function Testimonials() {
  try {
    const testimonials = await fetchTestimonials();
    return <TestimonialsContent testimonials={testimonials} />;
  } catch (error) {
    // Show default testimonials instead of crashing
    console.error('Failed to fetch testimonials:', error);
    return <TestimonialsContent testimonials={DEFAULT_TESTIMONIALS} />;
  }
}
```

## Page Composition Example

```typescript
// Home page composition
export default async function Home() {
  return (
    <MainLayout>
      <MainHeader title="Welcome to Heavenly Treatments" />
      <Introduction />
      <Services />
      <Experience />
      <Testimonials />
      <LocationAndBooking />
    </MainLayout>
  );
}
```

## Testing

Test sections with mocked data:

```typescript
describe('Testimonials section', () => {
  it('displays testimonials', () => {
    render(
      <TestimonialsContent testimonials={mockTestimonials} />
    );
    expect(screen.getByText(mockTestimonials[0].author)).toBeInTheDocument();
  });

  it('shows fallback for empty state', () => {
    render(<TestimonialsContent testimonials={[]} />);
    expect(screen.getByText(/no testimonials/i)).toBeInTheDocument();
  });
});
```

## Performance

- Lazy load images outside viewport
- Use `priority` prop for above-fold images
- Consider static generation for sections
- Cache expensive data fetches
- Use ISR for content updates

## NewHome Variants

Use alternative components for:
- Design experiments
- A/B testing layouts
- Seasonal variations
- Feature testing

Simply swap import:
```typescript
// Current design
import { MainHeader } from '@/components/Sections/MainHeader';

// New design
import { MainHeader } from '@/components/Sections/NewHome/MainHeader';
```
