# lib/cms/ - Content Fetching Layer

High-level functions for fetching content from Sanity CMS.

## Pattern

Each file exports async functions that fetch specific content types. Functions should:
- Use Sanity client from `@/lib/sanity/client`
- Include error handling with try/catch
- Return typed data or empty defaults
- Support caching with `revalidate` in server components

## Files

### treatments.ts

Fetch treatment-related data:

```typescript
// Fetch all treatments with details
export async function fetchTreatments(): Promise<Treatment[]>

// Fetch single treatment by slug
export async function fetchTreatmentBySlug(slug: string): Promise<Treatment | null>

// Fetch all treatment categories
export async function fetchTreatmentCategories(): Promise<TreatmentCategory[]>

// Fetch treatments in specific category
export async function fetchTreatmentsByCategory(slug: string): Promise<Treatment[]>
```

## Usage

### In Server Components

```typescript
import { fetchTreatments } from '@/lib/cms/treatments';

export default async function Page() {
  const treatments = await fetchTreatments();
  return <TreatmentsGrid treatments={treatments} />;
}
```

### With ISR (Incremental Static Regeneration)

```typescript
export const revalidate = 3600; // 1 hour

export default async function Page() {
  const treatments = await fetchTreatments();
  // Data will be regenerated every hour
  return <TreatmentsGrid treatments={treatments} />;
}
```

## Error Handling Pattern

```typescript
export async function fetchTreatments(): Promise<Treatment[]> {
  try {
    const treatments = await sanityClient.fetch<Treatment[]>(
      `*[_type == "treatment"] | order(title)`
    );
    return treatments ?? [];
  } catch (error) {
    console.error('Failed to fetch treatments:', error);
    // Return empty array or fallback data
    return [];
  }
}
```

## Type Safety

All functions should return typed data:

```typescript
// ✅ Good
export async function fetchTreatments(): Promise<Treatment[]> {
  // ...
}

// ❌ Bad
export async function fetchTreatments(): Promise<any> {
  // ...
}
```

## Adding New Content Fetching

1. Create function with clear name (`fetch[ContentType]`)
2. Add GROQ query in `@/lib/sanity/queries.ts`
3. Use Sanity client with proper typing
4. Include error handling
5. Document with comments
6. Add to exports

## Testing

Test data fetching with Sanity client mocks:

```typescript
// Mock Sanity client
vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}));

// Test function
describe('fetchTreatments', () => {
  it('returns treatments array', async () => {
    const mockData = [{ _id: '1', title: 'Massage' }];
    sanityClient.fetch.mockResolvedValue(mockData);
    
    const result = await fetchTreatments();
    expect(result).toEqual(mockData);
  });
});
```
