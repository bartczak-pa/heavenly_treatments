# components/Layout/ - Global Layout Components

Reusable layout components used across all pages: navigation, footer, and wrappers.

## Components

### Navbar.tsx

Top navigation bar displayed on all pages.

**Features**:
- Centered business name/logo
- Left-aligned menu links (Home, About, Treatments, Contact)
- Right-aligned "Book Now" button
- Mobile hamburger menu (responsive)
- Active link highlighting
- Sticky or fixed positioning

**Props**:
```typescript
interface NavbarProps {
  activeLink?: string; // Current route for highlighting
}
```

**Usage**:
```typescript
<Navbar activeLink={currentPath} />
```

**Behavior**:
- Links navigate to pages
- "Book Now" button links to Calendly
- Menu collapses to hamburger on mobile (<768px)
- Active route shows visual indicator

### Footer.tsx

Site footer with contact info, links, and policies.

**Sections**:
- Contact information (phone, email, address)
- Navigation links (duplicate of navbar)
- Social media links
- Policy links (Privacy, Terms, Cookie Policy)
- Copyright notice

**Usage**:
```typescript
<Footer />
```

**Data Source**:
- Contact info from `@/lib/data/contactInfo`
- Navigation structure mirrors Navbar
- Static policy page links

### MainLayout.tsx

Wrapper component that combines Navbar + Footer + Layout.

**Pattern**:
Server component that wraps page content:

```typescript
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

**Usage in Pages**:
```typescript
export default function Page() {
  return (
    <MainLayout>
      <PageContent />
    </MainLayout>
  );
}
```

### CookieConsentWrapper.tsx

Cookie consent banner component.

**Features**:
- Displays consent notice
- Accept/Decline buttons
- Remembers user choice in localStorage
- Only renders on client side
- Uses `react-cookie-consent`

**Props**:
```typescript
interface CookieConsentWrapperProps {
  children: React.ReactNode;
}
```

**Usage**:
Typically wrapped around entire app in root layout:

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CookieConsentWrapper>
          {children}
        </CookieConsentWrapper>
      </body>
    </html>
  );
}
```

**Behavior**:
- Shows banner to new visitors
- Stores consent choice in localStorage with key `CookieConsent`
- Respects user's previous choice
- Only renders after hydration (client-side)

### TreatmentCategoryLinks.tsx

Navigation component showing treatment category links.

**Purpose**:
- Display treatment categories as buttons/links
- Navigate to category pages
- Used in filter sections or sidebars

**Props**:
```typescript
interface TreatmentCategoryLinksProps {
  categories: TreatmentCategory[];
  activeCategory?: string;
  onCategorySelect?: (slug: string) => void;
}
```

**Usage**:
```typescript
<TreatmentCategoryLinks 
  categories={categories}
  activeCategory={selectedCategory}
  onCategorySelect={handleSelect}
/>
```

**Styling**:
- Highlights active category
- Responsive grid layout
- Consistent with design system

## Styling Approach

All layout components use:
- TailwindCSS for utility styling
- shadcn/ui components for UI elements (buttons, navigation items)
- CVA (Class Variance Authority) for variant management
- Responsive classes for mobile/tablet/desktop

**Example**:
```typescript
<nav className="flex items-center justify-between px-4 py-3 md:px-6">
  <div className="text-2xl font-bold">{SITE_NAME}</div>
  <div className="hidden md:flex gap-4">
    {/* Desktop menu */}
  </div>
  <button className="md:hidden">
    {/* Mobile menu button */}
  </button>
</nav>
```

## Mobile Responsiveness

### Breakpoints
- Mobile: < 768px (hidden desktop elements)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Responsive Patterns
```typescript
// Hidden on mobile, visible on desktop
<div className="hidden md:block">Desktop content</div>

// Visible on mobile, hidden on desktop
<div className="md:hidden">Mobile content</div>

// Responsive spacing
<nav className="px-4 md:px-6 lg:px-8">
```

## Common Tasks

### Update Navigation Links
1. Open `Navbar.tsx`
2. Find menu links array
3. Add/remove/modify routes
4. Also update `Footer.tsx` to match
5. Test responsive menu

### Change Navbar Color/Styling
1. Open `Navbar.tsx`
2. Modify TailwindCSS classes
3. Update active link color
4. Test in both mobile/desktop

### Add Social Media Links
1. Open `Footer.tsx`
2. Add social icons from Lucide React
3. Link to social profiles from `lib/config`
4. Style with consistent spacing

### Modify Cookie Consent
1. Open `CookieConsentWrapper.tsx`
2. Update consent text message
3. Customize button styling
4. Review localStorage key if changed

## Type Definitions

```typescript
// Navigation item
interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

// Treatment category for links
interface TreatmentCategory {
  _id: string;
  name: string;
  slug: { current: string };
}
```

## Performance Notes

- Navbar/Footer are rendered on every page → keep lightweight
- Use `React.memo()` to prevent unnecessary re-renders
- Lazy load heavy components within sections
- Consider code splitting for mobile menu

## Testing

Unit tests in `__tests__/components/Layout/`:

```typescript
describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('highlights active link', () => {
    render(<Navbar activeLink="/about" />);
    expect(screen.getByRole('link', { name: /about/i })).toHaveClass('active');
  });
});
```

## Integration Points

- **Navigation**: All pages include Navbar
- **Footer**: All pages include Footer
- **MainLayout**: Reusable wrapper for consistent structure
- **CookieConsent**: Wraps entire app in root layout
- **Contact Info**: Fetches from `lib/data/contactInfo`
