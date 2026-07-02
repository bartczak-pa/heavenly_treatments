import { groq } from 'next-sanity';

/**
 * GROQ query: treatment count per category slug, no treatment payload fetched
 */
export const treatmentCountsByCategoryQuery = groq`
  *[_type == "treatmentCategory"] {
    "slug": slug.current,
    "count": count(*[_type == "treatment" && references(^._id)])
  }
`;

/**
 * GROQ query to fetch all treatment categories with their details
 */
export const allCategoriesQuery = groq`
  *[_type == "treatmentCategory"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    shortDescription,
    image,
    iconName,
    displayOrder
  }
`;

/**
 * GROQ query to fetch a single category by slug
 */
export const categoryBySlugQuery = groq`
  *[_type == "treatmentCategory" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    shortDescription,
    image,
    iconName
  }
`;

/**
 * GROQ query to fetch all treatments with their category details
 */
export const allTreatmentsQuery = groq`
  *[_type == "treatment"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    duration,
    price,
    keyFeatures,
    image,
    freshaUrl,
    category->{
      _id,
      name,
      "slug": slug.current
    }
  }
`;

/**
 * GROQ query to fetch a single treatment by slug
 */
export const treatmentBySlugQuery = groq`
  *[_type == "treatment" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    duration,
    price,
    keyFeatures,
    benefits,
    whatToExpect,
    whatIsIncluded,
    goodFor,
    image,
    freshaUrl,
    category->{
      _id,
      name,
      "slug": slug.current
    }
  }
`;

/**
 * GROQ query to fetch treatments by category slug
 */
export const treatmentsByCategoryQuery = groq`
  *[_type == "treatment" && category->slug.current == $categorySlug] {
    _id,
    title,
    "slug": slug.current,
    description,
    duration,
    price,
    keyFeatures,
    image,
    freshaUrl,
    category->{
      _id,
      name,
      "slug": slug.current
    }
  }
`;

/**
 * GROQ query to fetch a lean, accordion-row-shaped list of treatments for a
 * single category. Parameterized by `$categorySlug` so filtering happens
 * server-side (no fetch-all-then-filter), and projects only the fields the
 * lazy-loaded accordion menu renders (no image asset).
 */
export const treatmentsMenuByCategoryQuery = groq`
  *[_type == "treatment" && category->slug.current == $categorySlug] {
    _id,
    title,
    "slug": slug.current,
    description,
    duration,
    price,
    "categorySlug": category->slug.current
  }
`;

/**
 * GROQ query to fetch all treatment slugs for static generation
 */
export const allTreatmentSlugsQuery = groq`
  *[_type == "treatment"] {
    "slug": slug.current,
    "categorySlug": category->slug.current
  }
`;

/**
 * GROQ query to fetch all category slugs for static generation
 */
export const allCategorySlugsQuery = groq`
  *[_type == "treatmentCategory"] {
    "slug": slug.current
  }
`;

/**
 * GROQ query to fetch all testimonials ordered by displayOrder
 */
export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(displayOrder asc) {
    _id,
    name,
    quote,
    customerType,
    rating,
    displayOrder
  }
`;

/**
 * GROQ query to fetch the active promotional offer.
 * Filters by isActive, and optionally by startDate/endDate using now().
 * If multiple offers are active simultaneously, returns the most recently
 * created one (ordered by _createdAt desc, taking [0]).
 */
export const activePromotionalOfferQuery = groq`
  *[_type == "promotionalOffer"
    && isActive == true
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())
  ] | order(_createdAt desc) [0] {
    _id,
    title,
    description,
    image { asset, alt },
    ctaText,
    ctaLink,
    dismissDurationDays,
    displayDelaySeconds
  }
`;
