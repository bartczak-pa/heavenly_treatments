import { Treatment } from '@/lib/data/treatments';
import { config } from '@/lib/config';

const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || '';

export interface Address {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHoursSpecification {
    dayOfWeek: string[];
    opens: string;
    closes: string;
}

export interface ContactInfo {
    address: Address;
    phone: string;
    email: string;
    openingHours: OpeningHoursSpecification[];
    mapSrc: string;
}

/**
 * Generates JSON-LD structured data for a Service schema.
 * 
 * @param treatment - The treatment data object.
 * @param contactInfo - The contact information object matching the ContactInfo interface.
 * @returns The JSON-LD object representing the service.
 */
export function generateServiceJsonLd(treatment: Treatment, contactInfo: ContactInfo) {
    const contactHref = `/contact?treatment=${encodeURIComponent(treatment.title)}`;
    
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: treatment.title,
        description: treatment.description.substring(0, config.seo.MAX_STRUCTURED_DATA_DESCRIPTION),
        image: treatment.image ? `${BASE_URL}${treatment.image}` : undefined,
        sameAs: [
            'https://www.facebook.com/heavenlytreatmentswithhayleybell',
            'https://www.instagram.com/heavenlytreatments_hayleybell/'
        ],
        url: `${BASE_URL}/treatments/${treatment.category}/${treatment.slug}`,
        provider: {
            '@type': 'Organization',
            name: 'Heavenly Treatments with Hayleybell',
            url: `${BASE_URL}/contact`,
            logo: `${BASE_URL}/images/logo.png`,
            address: contactInfo.address,
            telephone: contactInfo.phone,
            email: contactInfo.email,
            openingHoursSpecification: contactInfo.openingHours,
            hasMap: contactInfo.mapSrc,
        },
        timeRequired: treatment.duration,
        offers: {
            '@type': 'Offer',
            price: treatment.price.replace('£', ''),
            priceCurrency: 'GBP',
            url: `${BASE_URL}${contactHref}`,
            category: treatment.category,
        },
    };
}

// Future functions for other schemas like Organization, WebSite, BreadcrumbList can be added here.
// export function generateOrganizationJsonLd(contactInfo: ContactInfo) { ... }

/**
 * Optional aggregate rating data for the business schema.
 */
export interface AggregateRatingData {
  ratingValue: number;
  reviewCount: number;
}

/**
 * Generates JSON-LD structured data for a HealthAndBeautyBusiness schema.
 *
 * @param contactInfo - The contact information object.
 * @param aggregateRating - Optional aggregate rating data (ratingValue, reviewCount).
 * @returns The JSON-LD object representing the business.
 */
export function generateHealthAndBeautyBusinessJsonLd(
    contactInfo: ContactInfo,
    aggregateRating?: AggregateRatingData
) {
    const baseSchema = {
        '@context': 'https://schema.org',
        '@type': 'HealthAndBeautyBusiness',
        name: 'Heavenly Treatments with Hayleybell',
        url: `${BASE_URL}/treatments`,
        image: `${BASE_URL}/images/logo.png`,
        sameAs: [
            'https://www.facebook.com/heavenlytreatmentswithhayleybell',
            'https://www.instagram.com/heavenlytreatments_hayleybell/'
        ],
        address: contactInfo.address,
        telephone: contactInfo.phone,
        email: contactInfo.email,
        openingHours: contactInfo.openingHours,
        hasMap: contactInfo.mapSrc,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: config.location.COORDINATES.LATITUDE,
            longitude: config.location.COORDINATES.LONGITUDE,
        },
    };

    // Add aggregateRating if provided
    if (aggregateRating) {
        return {
            ...baseSchema,
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: aggregateRating.ratingValue,
                reviewCount: aggregateRating.reviewCount,
                bestRating: 5,
                worstRating: 1,
            },
        };
    }

    return baseSchema;
}

/**
 * Generates JSON-LD structured data for a WebSite schema.
 *
 * @returns The JSON-LD object representing the website.
 */
export function generateWebSiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Heavenly Treatments with Hayleybell',
        url: BASE_URL,
        sameAs: [
            'https://www.facebook.com/heavenlytreatmentswithhayleybell',
            'https://www.instagram.com/heavenlytreatments_hayleybell/'
        ],
    };
}

// Define the structure for a breadcrumb item
interface BreadcrumbItem {
  name: string;
  item: string; // URL
}

/**
 * Generates JSON-LD structured data for a BreadcrumbList schema.
 * 
 * @param items - An array of BreadcrumbItem objects, in order.
 * @returns The JSON-LD object representing the breadcrumb list.
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item, // URL for the breadcrumb item
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemListElement,
  };
}

// Define the structure for an FAQ item
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generates JSON-LD structured data for a FAQPage schema.
 *
 * @param faqs - An array of FAQ items with question and answer
 * @returns The JSON-LD object representing the FAQ page
 */
export function generateFAQJsonLd(faqs: FAQItem[]) {
  const mainEntity = faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity,
  };
}
