# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Heavenly Treatments** is a Next.js-based spa studio website showcasing treatments,
therapist information, and Calendly integration. The site uses modern technologies:
Next.js 15, React 19, TypeScript, TailwindCSS, Radix UI, and Sanity CMS for content
management. Deployed on Vercel.

### Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS 4 + shadcn/ui components
- **CMS**: Sanity for dynamic content (treatments, testimonials, etc.)
- **Form Handling**: React Hook Form + Zod validation
- **Email**: Resend for contact form submissions
- **External Services**: Calendly (booking), Turnstile (CAPTCHA)
- **Hosting**: Vercel with automatic deployments from main branch

### Project Structure

```text
app/                    # Next.js App Router pages and layouts
├── (routes)/           # Grouped routes for organization
├── api/                # API endpoints
└── styles/             # Global styles

components/             # React components organized by domain
├── Layout/             # Navigation, footer, layout wrappers
├── Sections/           # Page sections (hero, testimonials, etc.)
├── Treatments/         # Treatment-specific components
├── Contact/            # Contact form and related components
├── Email/              # Email template components
├── Analytics/          # Analytics wrappers
├── Shared/             # Reusable utilities and shared components
├── Lightweight/        # Minimal components (badges, tags)
├── Dynamic/            # Dynamic rendering components
└── ui/                 # shadcn/ui components (auto-generated)

lib/                    # Utilities and helpers
├── cms/                # Sanity CMS utilities and queries
├── data/               # Static data and constants
├── sanity/             # Sanity client configuration
├── validations/        # Zod schemas for form validation
└── utils.ts            # General utilities

sanity/                 # Sanity CMS configuration
└── schemas/            # Sanity document and field schemas

hooks/                  # Custom React hooks
public/                 # Static assets
__tests__/              # Test files (mirrors src structure)
test/                   # Vitest configuration and setup
```

## Development Commands

### Core Development

- **`npm run dev`** - Start development server with Turbopack (<http://localhost:3000>)
- **`npm run build`** - Production build
- **`npm run start`** - Run production server
- **`npm run typecheck`** - TypeScript type checking (no emit)

### Testing

- **`npm run test`** - Run tests once
- **`npm run test:watch`** - Watch mode for tests
- **`npm run test:coverage`** - Coverage report
- **`npm run test:ui`** - Vitest UI dashboard

### Code Quality

- **`npm run lint`** - Run ESLint for .ts, .tsx, .js, .jsx
- **`npm run lint:md`** - Lint markdown files
- **`npm run lint:md:fix`** - Auto-fix markdown formatting

### Build Analysis

- **`npm run analyze`** - Generate bundle analysis report
- **`npm run analyze:server`** - Analyze and serve bundle report on port 8888
- **`npm run build:analyze`** - Build and analyze in one command

### Content & Deployment

- **`npm run sanity:migrate`** - Run Sanity migration scripts
- **`npm run sanity:deploy`** - Deploy Sanity schema changes

### Optimization

- **`npm run optimize-images`** - Optimize images in public directory using imagemin

## Testing Strategy

- **Framework**: Vitest (config in `vitest.config.ts`)
- **Environment**: jsdom for DOM testing
- **Setup**: `test/setup.ts` runs before tests
- **Structure**: Tests mirror source structure in `__tests__/` directory
- **Test a single file**: `npm run test -- path/to/file.test.ts`
- **Watch specific file**: `npm run test:watch -- path/to/file.test.ts`

## Key Technologies & Patterns

### TypeScript & Strict Mode

- Strict mode enabled (`strict: true`)
- Type-aware linting enabled
- All new code must be fully typed
- Props validated via TypeScript interfaces (not PropTypes)

### Styling with TailwindCSS 4

- PostCSS setup in `postcss.config.mjs`
- shadcn/ui components in `components/ui/` (auto-generated from `components.json`)
- Tailwind merge for className conflict resolution
- Class variance authority for component variants

### React Hook Form + Zod

- Form validation schemas in `lib/validations/`
- Contact form in `components/Contact/`
- Error handling with Zod parser errors
- Toast notifications via custom hook `useContactFormToast`

### Sanity CMS Integration

- **Config**: `sanity.config.ts` and `sanity.cli.ts`
- **Schemas**: `sanity/schemas/` (document types and fields)
- **Queries**: Utilities in `lib/cms/` for fetching content
  - ⚠️ **Performance**: Always use parameterized queries for filtering (e.g., `getTreatmentsByCategory()`)
  - ❌ **Anti-pattern**: Never fetch all items then filter client-side
  - ✅ **Pattern**: Use GROQ filtering at query level for O(1) performance
- **Images**: Sanity image optimization via `@sanity/image-url`
- **Studio**: Accessible at `/studio` route (structure tool + vision tool)

### Image Optimization

- Sharp for image processing
- Next.js Image component with optimization
- Remote patterns configured for `cdn.sanity.io`
- Formats: AVIF and WebP with fallbacks
- Responsive sizes: 320px, 640px, 1024px, 1280px, 1536px, 1920px

### Environmental Configuration

- Environment variables in `.env.local` (not committed)
- Public vars prefixed with `NEXT_PUBLIC_`
- Sanity project ID and dataset in environment
- Type-safe env access via `lib/env.ts`

#### Analytics Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA4_DEBUG` | Enable GA4 debug logging to console | `false` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | Required for tracking |

## Code Organization Rules

### Naming Conventions

- **Components**: PascalCase (e.g., `ContactForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useContactFormToast.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`, `cookieUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase with `Type` or `Props` suffix

### Import Path Aliases

- **`@/*`** - Root directory
- **`@/components/*`** - Components directory
- **`@/app/*`** - App directory
- Configured in `tsconfig.json`

### Component Best Practices

- Use functional components (no class components)
- Prefer React hooks over HOCs
- Extract reusable UI patterns to `components/ui/` or `components/Shared/`
- Use `ErrorBoundary` wrapper for error handling
- Implement `OptimizedImage` for image rendering

### Forms & Validation

- Use React Hook Form for form state management
- Define Zod schemas in `lib/validations/` before creating forms
- Always validate on client before submission
- Handle server-side validation errors gracefully
- Show toast notifications for success/error feedback

## Performance Considerations

### Bundle Optimization

- Use `optimizePackageImports` in `next.config.mjs` for tree-shaking
- Lazy load heavy components with `dynamic()` when appropriate
- Monitor bundle size regularly: `npm run analyze`

### Image Handling

- Always use Next.js `Image` component (via `OptimizedImage`)
- Optimize images: `npm run optimize-images`
- Use responsive image sizes
- Lazy load off-screen images by default

### Core Web Vitals

- Focus on LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift)
- Use `@vercel/speed-insights` for monitoring
- Minimize critical CSS and JavaScript in head
- Defer non-critical scripts

## Git Workflow

### Branch Conventions

- Feature branches: `feature/<description>` (e.g., `feature/fresha-integration`)
- Bug fixes: `fix/<description>`
- Current main branch: `main`
- Current feature branch: `feature/fresha` (check git status)

### Pre-commit Hooks

- Husky setup in `.husky/` directory
- Pre-commit hook in `.husky/pre-commit`
- Runs linting and formatting checks automatically
- ESLint fixes and Prettier formatting via lint-staged

### Commit Messages

- Descriptive messages following convention
- Reference issue numbers when applicable
- Keep commits focused on single concerns

## Testing & Quality Gates

### ESLint Rules

- Next.js core-web-vitals rules enabled
- TypeScript-eslint recommended and type-checked rules
- React best practices enforced
- Prettier integration for formatting conflicts

### Type Checking

- Always run `npm run typecheck` before committing
- Fix any type errors—don't use `@ts-ignore` without justification
- Strict null checks enabled

### Pre-deployment Checklist

- ✅ `npm run typecheck` passes
- ✅ `npm run lint` passes
- ✅ `npm run test` passes
- ✅ `npm run build` succeeds
- ✅ Manual testing on target devices

## Content Management (Sanity)

### Common Tasks

- **Access Studio**: Visit `/studio` in development or deployed site
- **Create content**: Use Sanity Studio interface (no direct schema edits needed for content)
- **Schema changes**: Edit files in `sanity/schemas/`, then run `npm run sanity:deploy`
- **Data migrations**: Use scripts in `scripts/` directory

### Sanity Queries

- Located in `lib/cms/` utilities
- Use GROQ query language
- Fetch data at build time or via API routes when possible
- Cache responses appropriately

## Performance Optimizations

### Completed Optimizations

1. **Parameterized Treatment Queries** (2025-11-08)
   - Issue: `/treatments` page was fetching ALL treatments then filtering client-side
   - Solution: Use `getTreatmentsByCategory(slug)` for category-filtered requests
   - Result: 75% faster Sanity queries, reduced TTFB by ~900ms
   - File: `/app/treatments/page.tsx` (lines 138-140)
   - See: `claudedocs/PERFORMANCE_OPTIMIZATION_PLAN.md` for full optimization roadmap

### Planned Optimizations

- Add blur placeholders to Sanity images (reduce LCP)
- Move high-priority components to static imports (reduce FCP)
- Implement mobile CLS fixes with aspect-ratio CSS
- Add cache-control headers for ISR pages

See `claudedocs/PERFORMANCE_OPTIMIZATION_PLAN.md` v2.0 for complete strategy.

## Deployment

### Vercel Integration

- Connected to GitHub repository
- Automatic deployments on push to main
- Preview deployments for PRs
- Environment variables configured in Vercel dashboard
- Check deployment status at Vercel dashboard

### Environment Setup

- Development: `.env.local` with local overrides
- Production: Environment variables in Vercel project settings
- `NEXT_PUBLIC_*` variables visible in browser (no secrets here)

## Important Files & Quick Reference

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js configuration, image optimization, rewrites, redirects |
| `tailwind.config.js` | TailwindCSS customization |
| `tsconfig.json` | TypeScript compiler options and path aliases |
| `vitest.config.ts` | Test runner configuration |
| `eslint.config.mjs` | Linting rules |
| `components.json` | shadcn/ui component configuration |
| `sanity.config.ts` | Sanity CMS project configuration |
| `lib/env.ts` | Type-safe environment variable access |

## Troubleshooting

### Build Fails

1. Clear `.next` directory: `rm -rf .next`
2. Run `npm run typecheck` to find type errors
3. Check for missing environment variables in `.env.local`
4. Verify all imports use correct path aliases

### Test Failures

1. Check `test/setup.ts` for missing test utilities
2. Ensure jsdom environment is compatible with test code
3. Run with `--reporter=verbose` for detailed output

### Sanity Issues

- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
- Check Sanity API keys in environment variables
- Run `npm run sanity:migrate` if schema changed
- Visit `/studio` to verify connection

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks API](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Vitest Guide](https://vitest.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
