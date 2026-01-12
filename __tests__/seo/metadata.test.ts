import { describe, it, expect } from 'vitest';
import {
  generateWebSiteJsonLd,
  generateHealthAndBeautyBusinessJsonLd,
  generateServiceJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
} from '@/lib/jsonLsUtils';
import { config } from '@/lib/config';
import { Treatment, TreatmentCategorySlug } from '@/lib/data/treatments';

// Mock contact info for testing
const mockContactInfo = {
  address: {
    streetAddress: '123 Test Street',
    addressLocality: 'Kelso',
    postalCode: 'TD5 7XX',
    addressCountry: 'GB',
  },
  phone: '+44 1234 567890',
  email: 'test@example.com',
  openingHours: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  mapSrc: 'https://maps.google.com/test',
};

// Mock treatment for testing - using proper type
const mockTreatment: Treatment = {
  id: 'test-1',
  title: 'Swedish Massage',
  slug: 'swedish-massage',
  description: 'A relaxing full body massage using traditional Swedish techniques.',
  price: '£65',
  duration: '60 minutes',
  category: 'massage' as TreatmentCategorySlug,
  keyFeatures: ['Relaxing', 'Full body'],
  image: '/images/treatments/swedish.jpg',
};

describe('SEO Configuration', () => {
  describe('Meta Description Length', () => {
    it('should have MAX_DESCRIPTION_LENGTH of 160 or less', () => {
      expect(config.seo.MAX_DESCRIPTION_LENGTH).toBeLessThanOrEqual(160);
    });
  });
});

describe('JSON-LD Schema Generation', () => {
  describe('generateWebSiteJsonLd', () => {
    it('should generate valid WebSite schema', () => {
      const schema = generateWebSiteJsonLd();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Heavenly Treatments with Hayleybell');
      expect(schema.sameAs).toBeInstanceOf(Array);
    });

    it('should NOT include SearchAction (removed per SEO plan)', () => {
      const schema = generateWebSiteJsonLd();

      expect(schema).not.toHaveProperty('potentialAction');
    });
  });

  describe('generateHealthAndBeautyBusinessJsonLd', () => {
    it('should generate valid HealthAndBeautyBusiness schema', () => {
      const schema = generateHealthAndBeautyBusinessJsonLd(mockContactInfo);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('HealthAndBeautyBusiness');
      expect(schema.name).toBeDefined();
      expect(schema.address).toBeDefined();
      expect(schema.telephone).toBe(mockContactInfo.phone);
      expect(schema.email).toBe(mockContactInfo.email);
    });

    it('should include geo coordinates', () => {
      const schema = generateHealthAndBeautyBusinessJsonLd(mockContactInfo);

      expect(schema.geo).toBeDefined();
      expect(schema.geo['@type']).toBe('GeoCoordinates');
      expect(schema.geo.latitude).toBeDefined();
      expect(schema.geo.longitude).toBeDefined();
    });

    it('should NOT include aggregateRating when not provided', () => {
      const schema = generateHealthAndBeautyBusinessJsonLd(mockContactInfo);

      expect(schema).not.toHaveProperty('aggregateRating');
    });

    it('should include aggregateRating when provided', () => {
      const schema = generateHealthAndBeautyBusinessJsonLd(mockContactInfo, {
        ratingValue: 4.9,
        reviewCount: 50,
      });

      expect(schema).toHaveProperty('aggregateRating');
      // Type assertion since we know aggregateRating is present when parameter is provided
      const schemaWithRating = schema as typeof schema & {
        aggregateRating: {
          '@type': string;
          ratingValue: number;
          reviewCount: number;
          bestRating: number;
          worstRating: number;
        };
      };
      expect(schemaWithRating.aggregateRating['@type']).toBe('AggregateRating');
      expect(schemaWithRating.aggregateRating.ratingValue).toBe(4.9);
      expect(schemaWithRating.aggregateRating.reviewCount).toBe(50);
      expect(schemaWithRating.aggregateRating.bestRating).toBe(5);
      expect(schemaWithRating.aggregateRating.worstRating).toBe(1);
    });
  });

  describe('generateServiceJsonLd', () => {
    it('should generate valid Service schema', () => {
      const schema = generateServiceJsonLd(mockTreatment, mockContactInfo);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Service');
      expect(schema.name).toBe(mockTreatment.title);
      expect(schema.description).toBeDefined();
    });

    it('should include provider information', () => {
      const schema = generateServiceJsonLd(mockTreatment, mockContactInfo);

      expect(schema.provider).toBeDefined();
      expect(schema.provider['@type']).toBe('Organization');
    });

    it('should include offers with price', () => {
      const schema = generateServiceJsonLd(mockTreatment, mockContactInfo);

      expect(schema.offers).toBeDefined();
      expect(schema.offers['@type']).toBe('Offer');
      expect(schema.offers.priceCurrency).toBe('GBP');
      expect(schema.offers.price).toBe('65'); // £ removed
    });

    it('should generate correct treatment URL', () => {
      const schema = generateServiceJsonLd(mockTreatment, mockContactInfo);

      expect(schema.url).toContain('/treatments/massage/swedish-massage');
    });
  });

  describe('generateBreadcrumbJsonLd', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const items = [
        { name: 'Home', item: 'https://example.com' },
        { name: 'Treatments', item: 'https://example.com/treatments' },
      ];
      const schema = generateBreadcrumbJsonLd(items);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
    });

    it('should assign correct positions to breadcrumb items', () => {
      const items = [
        { name: 'Home', item: 'https://example.com' },
        { name: 'Treatments', item: 'https://example.com/treatments' },
        { name: 'Massage', item: 'https://example.com/treatments/massage' },
      ];
      const schema = generateBreadcrumbJsonLd(items);

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    });
  });

  describe('generateFAQJsonLd', () => {
    it('should generate valid FAQPage schema', () => {
      const faqs = [
        { question: 'How do I book?', answer: 'Click Book Now button.' },
        { question: 'Where are you located?', answer: 'Kelso, Scottish Borders.' },
      ];
      const schema = generateFAQJsonLd(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
    });

    it('should format questions and answers correctly', () => {
      const faqs = [
        { question: 'Test question?', answer: 'Test answer.' },
      ];
      const schema = generateFAQJsonLd(faqs);

      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].name).toBe('Test question?');
      expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Test answer.');
    });
  });
});

describe('Schema Validation', () => {
  it('all schemas should produce valid JSON', () => {
    const schemas = [
      generateWebSiteJsonLd(),
      generateHealthAndBeautyBusinessJsonLd(mockContactInfo),
      generateHealthAndBeautyBusinessJsonLd(mockContactInfo, { ratingValue: 4.9, reviewCount: 50 }),
      generateServiceJsonLd(mockTreatment, mockContactInfo),
      generateBreadcrumbJsonLd([{ name: 'Home', item: '/' }]),
      generateFAQJsonLd([{ question: 'Q?', answer: 'A.' }]),
    ];

    schemas.forEach((schema) => {
      expect(() => JSON.stringify(schema)).not.toThrow();
    });
  });
});
