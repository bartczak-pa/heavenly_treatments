/**
 * Represents a single treatment offered.
 */
export interface Treatment {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string; // Relative path to the image in /public
    duration: string;
    price: string;
    keyFeatures?: string[]; // Optional array of key features
    category: TreatmentCategorySlug; // Link to the category
  }
  
  /**
   * Represents the different categories of treatments.
   */
  export interface TreatmentCategory {
    id: string;
    slug: TreatmentCategorySlug;
    name: string;
    image: string; // Relative path to the image in /public
    description?: string; // Optional description for the category page
    shortDescription?: string; // Optional short description for Nav or previews
  }
  
  // Define slugs for type safety
  export type TreatmentCategorySlug =
    | 'massages'
    | 'facials'
    | 'body-treatments'
    | 'waxing'
    | 'nails';
  
  // --- Treatment Categories ---
  export const treatmentCategories: TreatmentCategory[] = [
    {
      id: 'cat-1',
      slug: 'massages',
      name: 'Massages',
      description: 'Relax and rejuvenate with our range of massage therapies.',
      shortDescription: 'Relax and unwind with our therapeutic massage services.',
      image: '/images/treatments/massage.jpg',
    },
    {
      id: 'cat-2',
      slug: 'facials',
      name: 'Facial Treatments',
      description: 'Revitalize your skin with our specialized facial treatments.',
      shortDescription: 'Rejuvenate your skin with our specialized facial treatments.',
      image: '/images/treatments/facial.jpg',
    },
    {
      id: 'cat-3',
      slug: 'body-treatments',
      name: 'Body Treatments',
      description: 'Nourish and pamper your body from head to toe.',
      shortDescription: 'Experience our luxurious body treatments and therapies.',
      image: '/images/treatments/body-treatment.jpg',
    },
    {
      id: 'cat-4',
      slug: 'waxing',
      name: 'Waxing Services',
      description: 'Professional waxing services for various areas.',
      shortDescription: 'Professional waxing services for smooth, hair-free skin.',
      image: '/images/treatments/waxing.jpg',
    },
    {
      id: 'cat-5',
      slug: 'nails',
      name: 'Nail Care',
      description: 'Manicures, pedicures, and nail enhancements.',
      shortDescription: 'Pamper your hands and feet with our nail care services.',
      image: '/images/treatments/nails.jpg',
    },
  ];
  
  // --- Treatments Data ---
  export const allTreatments: Treatment[] = [
    // Massages
    {
      id: '1',
      title: 'Swedish Massage',
      slug: 'swedish-massage',
      description: 'A relaxing massage that uses long strokes and kneading to improve circulation and ease muscle tension.',
      image: '/images/treatments/swedish-massage.jpg', // Assuming images are in public/images/treatments
      duration: '60 minutes',
      price: '£50',
      keyFeatures: [
        'Reduces muscle tension and stress',
        'Improves blood circulation',
        'Promotes relaxation and well-being',
        'Uses gentle to moderate pressure',
      ],
      category: 'massages',
    },
    {
      id: '2',
      title: 'Deep Tissue Massage',
      slug: 'deep-tissue-massage',
      description: 'A therapeutic massage targeting deeper layers of muscle and connective tissue, ideal for chronic aches and pains.',
      image: '/images/treatments/deep-tissue-massage.jpg',
      duration: '60 minutes',
      price: '£60',
      keyFeatures: [
        'Relieves chronic muscle pain',
        'Breaks down scar tissue',
        'Improves range of motion',
        'Uses firm pressure and slow strokes',
      ],
      category: 'massages',
    },
    // Facials
    {
      id: '3',
      title: 'Hydrating Facial',
      slug: 'hydrating-facial',
      description: 'A facial treatment designed to deeply hydrate and nourish the skin, leaving it soft and supple.',
      image: '/images/treatments/hydrating-facial.jpg',
      duration: '45 minutes',
      price: '£40',
      keyFeatures: [
        'Intensely moisturizes dry skin',
        "Restores skin's natural barrier",
        'Leaves skin feeling smooth and refreshed',
        'Suitable for all skin types, especially dry',
      ],
      category: 'facials',
    },
    {
      id: '4',
      title: 'Anti-Aging Facial',
      slug: 'anti-aging-facial',
      description: 'A specialized facial that helps reduce the visible signs of aging, such as fine lines and wrinkles.',
      image: '/images/treatments/anti-aging-facial.jpg',
      duration: '60 minutes',
      price: '£55',
      keyFeatures: [
        'Targets fine lines and wrinkles',
        'Improves skin elasticity and firmness',
        'Promotes a youthful glow',
        'Uses collagen-boosting ingredients',
      ],
      category: 'facials',
    },
    // Body Treatments
    {
      id: '5',
      title: 'Body Scrub',
      slug: 'body-scrub',
      description: 'An exfoliating treatment that removes dead skin cells, leaving the skin smooth, soft, and radiant.',
      image: '/images/treatments/body-scrub.jpg',
      duration: '30 minutes',
      price: '£30',
      keyFeatures: [
        'Exfoliates dead skin cells',
        'Improves skin texture and tone',
        'Stimulates circulation',
        'Leaves skin soft and glowing',
      ],
      category: 'body-treatments',
    },
    {
      id: '6',
      title: 'Wrap Treatment',
      slug: 'wrap-treatment',
      description: 'A detoxifying and hydrating treatment where the body is wrapped in nourishing ingredients.',
      image: '/images/treatments/wrap-treatment.jpg',
      duration: '45 minutes',
      price: '£45',
      keyFeatures: [
        'Helps detoxify the body',
        'Deeply hydrates and conditions the skin',
        'Promotes relaxation',
        'Can improve skin firmness',
      ],
      category: 'body-treatments',
    },
  ];
  
  // --- Helper Functions  ---
  
  /**
   * Gets all treatments.
   * @returns An array of all treatments.
   */
  export const getTreatments = (): Treatment[] => {
    return allTreatments;
  };
  
  /**
   * Gets a specific treatment by its slug.
   * @param slug - The slug of the treatment to find.
   * @returns The treatment object or undefined if not found.
   */
  export const getTreatmentBySlug = (slug: string): Treatment | undefined => {
    return allTreatments.find((treatment) => treatment.slug === slug);
  };
  
  /**
   * Gets all treatment categories.
   * @returns An array of all treatment categories.
   */
  export const getCategories = (): TreatmentCategory[] => {
    return treatmentCategories;
  };
  
  /**
   * Gets treatments belonging to a specific category.
   * @param categorySlug - The slug of the category.
   * @returns An array of treatments in that category.
   */
  export const getTreatmentsByCategory = (categorySlug: TreatmentCategorySlug): Treatment[] => {
    return allTreatments.filter((treatment) => treatment.category === categorySlug);
  };