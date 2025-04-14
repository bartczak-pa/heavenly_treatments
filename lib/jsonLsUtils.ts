import { Treatment } from '@/lib/data/treatments';

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
        description: treatment.description.substring(0, 5000),
        image: treatment.image ? `${BASE_URL}${treatment.image}` : undefined,
        url: `${BASE_URL}/treatments/${treatment.category}/${treatment.slug}`,
        provider: {
            '@type': 'Organization',
            name: 'Heavenly Treatments with Hayleybell',
            url: `${BASE_URL}/contact`,
            logo: `${BASE_URL}/images/logo.png`,
            address: contactInfo.address,
            telephone: contactInfo.phone,
            email: contactInfo.email,
            openingHours: contactInfo.openingHours,
            hasMap: contactInfo.mapSrc,
        },
        offers: {
            '@type': 'Offer',
            price: treatment.price.replace('£', ''),
            priceCurrency: 'GBP',
            url: `${BASE_URL}${contactHref}`,
            serviceDuration: treatment.duration,
            category: treatment.category,
        },
    };
}

// Future functions for other schemas like Organization, WebSite, BreadcrumbList can be added here.
// export function generateOrganizationJsonLd(contactInfo: ContactInfo) { ... }

/**
 * Generates JSON-LD structured data for a HealthAndBeautyBusiness schema.
 * 
 * @param contactInfo - The contact information object.
 * @returns The JSON-LD object representing the business.
 */
export function generateHealthAndBeautyBusinessJsonLd(contactInfo: ContactInfo) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HealthAndBeautyBusiness',
        name: 'Heavenly Treatments with Hayleybell',
        url: `${BASE_URL}/treatments`,
        image: `${BASE_URL}/images/logo.png`,
        address: contactInfo.address,
        telephone: contactInfo.phone,
        email: contactInfo.email,
        openingHours: contactInfo.openingHours,
        hasMap: contactInfo.mapSrc,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '55.584',
            longitude: '-2.385',
        },
    };
}

/**
 * Generates JSON-LD structured data for a WebSite schema.
 * 
 * @returns The JSON-LD object representing the website.
 */
export function generateWebSiteJsonLd() {
    const searchUrl = `${BASE_URL}/search?q={search_term_string}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Heavenly Treatments with Hayleybell', // Site Name
        url: BASE_URL, // Base URL of the website
        potentialAction: { // Optional: Sitelinks Search Box
            '@type': 'SearchAction',
            target: `${searchUrl}`, 
            'query-input': 'required name=search_term_string',
        },
    };
}
