# components/ Directory - React Components

This directory contains all reusable React components organized by domain and purpose.

## Directory Structure

```
components/
├── CLAUDE.md               # This file
├── ErrorBoundary.tsx       # Global error boundary wrapper
├── OptimizedImage.tsx      # Next.js Image wrapper with optimization
│
├── Layout/                 # Global layout components
│   ├── Navbar.tsx          # Navigation bar with menu & Book Now button
│   ├── Footer.tsx          # Site footer
│   ├── MainLayout.tsx      # Root layout wrapper for pages
│   ├── CookieConsentWrapper.tsx    # Cookie consent banner
│   └── TreatmentCategoryLinks.tsx  # Category navigation links
│
├── Sections/               # Full-width page sections
│   ├── NewHome/            # New home page section variants
│   ├── MainHeader.tsx      # Hero/header sections
│   ├── Introduction.tsx    # Intro section
│   ├── Experience.tsx      # Experience/benefits section
│   ├── Services.tsx        # Services showcase
│   ├── MeetTherapist.tsx   # About therapist section
│   ├── MyStudio.tsx        # Studio photos/tour section
│   ├── Testimonials.tsx    # Client testimonials
│   ├── LocationAndBooking.tsx # Location & CTA
│   ├── Cta.tsx             # Call-to-action sections
│   └── ContactInfo.tsx     # Contact information display
│
├── Treatments/             # Treatment-specific components
│   ├── TreatmentsGrid.tsx  # Grid layout for treatments
│   ├── TreatmentCard.tsx   # Individual treatment card
│   ├── FilteredTreatmentsDisplay.tsx # Filtered results
│   └── CategoryFilters.tsx # Filter UI for categories
│
├── Contact/                # Contact form components
│   ├── ContactForm.tsx     # Form with validation
│   ├── ContactInfo.tsx     # Contact details display
│   └── MapEmbed.tsx        # Google Maps embed
│
├── Email/                  # Email template components
│   ├── [Email templates]   # Resend email templates
│
├── Dynamic/                # Dynamic rendering utilities
│   └── [Dynamic wrappers]  # Components with dynamic imports
│
├── Lightweight/            # Minimal utility components
│   └── [Small utilities]   # Badges, tags, simple UI
│
├── Analytics/              # Analytics wrappers
│   └── [Analytics tracking] # Vercel/tracking integration
│
├── Shared/                 # Shared utilities
│   └── [Shared helpers]    # Common functions used across components
│
└── ui/                     # shadcn/ui components (auto-generated)
    ├── button.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── checkbox.tsx
    ├── toast.tsx
    └── [other shadcn/ui components]
```

## Component Organization Principles

### 1. Domain-Driven Organization
- Components grouped by feature/domain (Treatments, Contact, Layout)
- Not grouped by type (containers, presentational)
- Makes finding related components easier

### 2. Component Naming
- **Sections**: Full-width page segments (e.g., `Services.tsx`)
- **Cards/Grids**: Reusable data display (e.g., `TreatmentCard.tsx`)
- **Forms**: Interactive input components (e.g., `ContactForm.tsx`)
- **Layout**: Navigation, footers, wrappers (e.g., `Navbar.tsx`)

### 3. Props & TypeScript
All components must be fully typed:
```typescript
interface TreatmentCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image?: string;
}

export function TreatmentCard({ 
  id, 
  title, 
  description, 
  price, 
  duration, 
  image 
}: TreatmentCardProps) {
  // Component implementation
}
```

## Key Components

### Layout Components

#### Navbar.tsx
- Fixed top navigation
- Centered business name
- Left-aligned menu (Home, About, Treatments, Contact)
- Right-aligned "Book Now" button
- Mobile hamburger menu for responsive
- Active link highlighting

#### Footer.tsx
- Contact information
- Social media links
- Navigation links (duplicate of navbar)
- Copyright and policy links
- Email signup (optional)

#### MainLayout.tsx
- Wraps pages with Navbar + Footer
- Handles layout spacing and padding
- May include cookie consent banner

#### CookieConsentWrapper.tsx
- Cookie consent banner
- Powered by `react-cookie-consent`
- Stores user preference in localStorage
- Loads only on client side

### Section Components

Sections are full-width page segments that can be composed on any page.

#### Testimonials.tsx
- Displays client testimonials
- Fetches from Sanity CMS
- Shows rating, name, image
- Responsive grid or carousel

#### MeetTherapist.tsx
- Therapist bio and photo
- Qualifications and certifications
- Philosophy/approach
- Data from Sanity

#### Services.tsx
- Featured treatments showcase
- Grid of treatment cards
- Links to full treatment pages

### Treatment Components

#### TreatmentsGrid.tsx
Props:
```typescript
{
  treatments: Treatment[];
  onFilter?: (category: string) => void;
  selectedCategory?: string;
}
```

#### TreatmentCard.tsx
- Individual treatment display
- Shows title, description, price, duration
- Click to view details or book

#### CategoryFilters.tsx
- Filter UI for treatment categories
- Toggles selected category
- Updates parent state

#### FilteredTreatmentsDisplay.tsx
- Shows filtered treatment list
- Handles empty states
- Responsive layout

### Contact Components

#### ContactForm.tsx
- React Hook Form with Zod validation
- Fields: name, email, subject, message
- Turnstile CAPTCHA integration
- Posts to `/api/contact`
- Shows toast notifications on success/error
- Uses `useContactFormToast` hook

#### ContactInfo.tsx
- Displays therapist contact details
- Phone, email, address
- Business hours
- Data from `lib/data/contactInfo.ts`

#### MapEmbed.tsx
- Google Maps embed
- Shows spa location
- Responsive iframe

### Email Components

Located in `components/Email/` - Resend email templates:
- `ContactFormEmail.tsx` - Confirmation email for form submissions
- Format: React components that render as HTML email
- Use semantic HTML for email compatibility

## Styling Patterns

### TailwindCSS + CVA
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('px-4 py-2 rounded', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={buttonVariants({ variant })}>{children}</button>;
}
```

### Merging Classes
Use `cn()` utility from `@/lib/utils`:
```typescript
<div className={cn('base-class', 'additional-class', condition && 'conditional')}>
```

## Image Handling

### OptimizedImage Component
Wrapper around Next.js `Image` for consistent optimization:
```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src={imageUrl}
  alt="Description"
  width={400}
  height={300}
  priority={false}
/>
```

- Handles Sanity image URLs
- Lazy loads by default
- Responsive sizes configured
- WebP/AVIF formats

## Form Handling

### React Hook Form Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validations/contact';

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { /* ... */ },
  });

  const onSubmit = async (data) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Validation Errors
Access via `form.formState.errors`:
```typescript
{errors.email && <span className="text-red-500">{errors.email.message}</span>}
```

## Client vs Server Components

### Server Components (Default)
Use for:
- Fetching Sanity data
- Rendering static layouts
- No interactivity needed

```typescript
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Client Components
Use `'use client'` directive for:
- Form handling and state
- Interactive UI (modals, dropdowns)
- Event listeners
- Hooks (useState, useEffect, etc.)

```typescript
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

## Component Composition Best Practices

### Do
- ✅ Keep components focused on single responsibility
- ✅ Extract reusable UI patterns to `Shared/`
- ✅ Use TypeScript interfaces for all props
- ✅ Document complex components with comments
- ✅ Separate concerns (data fetching in server component, UI in client)

### Don't
- ❌ Create deeply nested component trees
- ❌ Mix server and client concerns in one component
- ❌ Use `any` type for props
- ❌ Add business logic to presentational components
- ❌ Create single-use components (unless page-specific)

## Common Tasks

### Add New Section Component
1. Create file in `components/Sections/NewSection.tsx`
2. Define TypeScript interface for props
3. Import and use shadcn/ui components
4. Style with TailwindCSS + CVA
5. Export as named export
6. Import on page and compose

### Update Component Styling
1. Open component file
2. Modify TailwindCSS classes
3. Use `cn()` for conditional styles
4. Test responsive behavior at multiple breakpoints

### Add Form Field
1. Add field to Zod schema in `lib/validations/`
2. Add to React Hook Form in component
3. Add error display
4. Test validation

## Testing Components

- Test files mirror component structure in `__tests__/`
- Use React Testing Library
- Test user interactions, not implementation
- Mock Sanity data with fixtures

```typescript
// Example test
describe('TreatmentCard', () => {
  it('displays treatment information', () => {
    render(<TreatmentCard {...mockTreatment} />);
    expect(screen.getByText(mockTreatment.title)).toBeInTheDocument();
  });
});
```
