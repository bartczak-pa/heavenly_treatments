import { groq } from 'next-sanity';

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
    image,
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
    category->{
      _id,
      name,
      "slug": slug.current
    }
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
