import {
  Sun, // Seasonal Treatments
  HandHelping, // Massages
  SmilePlus, // Facials
  PersonStanding, // Body Treatments
  Footprints, // Reflexology
  LucideIcon // Import the type
} from 'lucide-react';

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
    description: string; // Description for the category page
    shortDescription: string; // Short description for Nav or previews
    iconName?: string; // Name of the Lucide icon
  }
  
  // Define slugs for type safety
  export type TreatmentCategorySlug =
    | 'seasonal-treatments'
    | 'massages'
    | 'facials'
    | 'body-treatments'
    | 'reflexology';
  
  // --- Treatment Categories ---
  export const treatmentCategories: TreatmentCategory[] = [
    {
      id: 'cat-1',
      slug: 'seasonal-treatments',
      name: 'Seasonal Treatments',
      description: 'Relax and rejuvenate with my range of seasonal treatments.',
      shortDescription: 'Relax and rejuvenate with my range of seasonal treatments.',
      image: '/images/categories/products_used_for_seasonal_treatments.jpg',
      iconName: 'Sun',
    },
    {
      id: 'cat-2',
      slug: 'massages',
      name: 'Massages',
      description: 'Revitalize your skin with my range of massages.',
      shortDescription: 'Rejuvenate your skin with my range of massages.',
      image: '/images/categories/woman-with-closed-eyes-enjoying-massage.jpg',
      iconName: 'HandHelping',
    },
    {
      id: 'cat-3',
      slug: 'facials',
      name: 'Facials',
      description: 'Nourish and pamper your body from head to toe.',
      shortDescription: 'Experience our luxurious body treatments and therapies.',
      image: '/images/categories/woman-salon-making-beauty-treatment-with-gua-sha-stone.jpg',
      iconName: 'SmilePlus',
    },
    {
      id: 'cat-4',
      slug: 'body-treatments',
      name: 'Body Treatments',
      description: 'Professional waxing services for various areas.',
      shortDescription: 'Professional waxing services for smooth, hair-free skin.',
      image: '/images/categories/woman-having-body-treatment.jpg',
      iconName: 'PersonStanding',
    },
    {
      id: 'cat-5',
      slug: 'reflexology',
      name: 'Reflexology',
      description: 'Relax and rejuvenate with my range of reflexology treatments.',
      shortDescription: 'Relax and rejuvenate with my range of reflexology treatments.',
      image: '/images/categories/person_having_reflexology_treatment.png',
      iconName: 'Footprints',
    },
  ];
  

  export const allTreatments: Treatment[] = [

    // Seasonal Treatments
    {
      id: 'seasonal-1',
      title: 'Pumpkin Pie Pamper',
      slug: 'pumpkin-pie-pamper',
      // SEO Description
      description: 'Indulge in a full-body seasonal treat featuring a warm pumpkin pie spice scrub, massage, and pampering for hands and feet.',
      image: '/images/treatments/products_used_for_pumpkin_pie_pamper.jpg',
      duration: '70 mins',
      price: '£45',
      keyFeatures: [
        'Pumpkin Pie back scrub',
        'Back, neck and shoulder massage',
        'Scrub on feet',
        'Foot massage with pumpkin pie balm',
        'Heated booties',
        'Scrub on hands',
        'Hand massage',
      ],
      category: 'seasonal-treatments',
    },
    {
      id: 'seasonal-2',
      title: 'Pumpkin Pie - Back',
      slug: 'pumpkin-pie-back',
      description: 'Enjoy a focused seasonal back treatment with an exfoliating pumpkin pie scrub followed by a soothing massage.',
      image: '/images/treatments/spicy-pumpkin-latte-wooden-board-with-sweater_501050-260.jpg',
      duration: '40 mins',
      price: '£35',
      keyFeatures: [
        'Pumpkin Pie back scrub',
        'Followed by massage',
      ],
      category: 'seasonal-treatments',
    },

    // Massages - Swedish
    {
      id: 'massage-1',
      title: 'Swedish Full Body Massage',
      slug: 'swedish-full-body-massage',
      description: 'Relax and unwind with a classic full-body Swedish massage tailored to your needs, improving circulation and easing muscle tension.',
      image: '/images/treatments/woman-getting-back-massage-from-masseur_23-2150461419.jpg',
      duration: '60 mins',
      price: '£40',
      keyFeatures: [
        'Full body massage tailored to your needs',
        'Uses a combination of gentle, flowing strokes, kneading, and circular movements',
        'Enhances blood flow',
        'Eases muscle tension',
        'Promotes overall well-being',
      ],
      category: 'massages',
    },
    {
      id: 'massage-2',
      title: 'Swedish Back, Neck & Shoulders',
      slug: 'swedish-back-neck-shoulders',
      description: 'Target tension in your back, neck, and shoulders with this focused Swedish massage designed for quick relief.',
      image: '/images/treatments/woman-getting-back-massage-from-female-masseur_23-2150461420.jpg',
      duration: '30 mins',
      price: '£25',
      keyFeatures: [
        'Back massage tailored to your needs using Swedish techniques',
      ],
      category: 'massages',
    },
    {
      id: 'massage-3',
      title: 'Swedish Full body & Express Facial',
      slug: 'swedish-full-body-express-facial',
      description: 'Combine full-body relaxation with facial rejuvenation in this 90-minute treatment featuring a Swedish massage and an express facial.',
      image: '/images/treatments/smiling-young-woman-procedure-face_7502-7528.avif',
      duration: '90 mins',
      price: '£50',
      keyFeatures: [
        '60 mins Swedish massage',
        'Followed by express facial',
        'Includes double cleanse, exfoliation, and mini facial massage',
      ],
      category: 'massages',
    },
    {
      id: 'massage-4',
      title: 'Back Cleanse & Swedish Massage',
      slug: 'back-cleanse-swedish-massage',
      description: 'Purify and relax with a back treatment including exfoliation, a mask application, and a soothing Swedish massage.',
      image: '/images/treatments/spa-concept-with-woman-massage_23-2147816926.jpg',
      duration: '50 mins',
      price: '£35',
      keyFeatures: [
        'Hot cloth exfoliation on the back',
        'Scrub application',
        'Masque application to the back',
        'Followed by Swedish massage',
      ],
      category: 'massages',
    },

    // Massages - Aromatherapy
    {
      id: 'massage-5',
      title: 'Aromatherapy Full Body Massage',
      slug: 'aromatherapy-full-body-massage',
      description: 'Enhance your relaxation with a soothing full-body aromatherapy massage using custom essential oil blends and inhalation.',
      image: '/images/treatments/young-woman-spa-environment_1098-1274.jpg',
      duration: '60 mins',
      price: '£45',
      keyFeatures: [
        'Full body soothing massage',
        'Uses your chosen essential oil blend',
        'Includes inhalation bowl',
      ],
      category: 'massages',
    },
    {
      id: 'massage-6',
      title: 'Aromatherapy Back, Neck & Shoulders',
      slug: 'aromatherapy-back-neck-shoulders',
      description: 'Soothe tension with a focused aromatherapy massage for your back, neck, and shoulders, enhanced with essential oils.',
      image: '/images/treatments/close-up-therapist-massaging-woman_23-2148815300.jpg',
      duration: '30 mins',
      price: '£30',
      keyFeatures: [
        'Back, neck and shoulder soothing massage',
        'Uses your chosen essential oil blend',
        'Includes inhalation bowl',
      ],
      category: 'massages',
    },
    {
      id: 'massage-7',
      title: 'Sleep Well Treatment',
      slug: 'sleep-well-treatment',
      description: 'Promote restful sleep with this calming treatment featuring lavender aromatherapy massage, hot compresses, and a relaxing scalp massage.',
      image: '/images/treatments/young-woman-relaxing-spa-salon_176420-7531.jpg',
      duration: '45 mins',
      price: '£35',
      keyFeatures: [
        'Hot lavender compress to feet',
        'Lavender aromatherapy back, neck and shoulder massage',
        'Followed by scalp massage',
        'Designed to ensure a good night\'s sleep',
      ],
      category: 'massages',
    },

    // Facials
    {
      id: 'facial-1',
      title: 'Seilich Botanicals Meadowsweet Facial',
      slug: 'seilich-meadowsweet-facial',
      description: 'Experience a luxurious facial using meadow-grown Seilich Botanicals products from Scotland, leaving your skin nourished and revitalized.',
      image: '/images/treatments/seilich_botanicals_products.jpg',
      duration: '60 mins',
      price: '£45',
      keyFeatures: [
        'Double cleanse with Peppermint',
        'Hot towel steam',
        'Meadow Clay mask',
        'Neck and shoulder massage',
        'Scalp massage',
        'Meadow Face Mist',
        'Nature\'s Secret Serum',
        'Wild Rose or Wild Carrot Moisturiser',
        'Sculpting and draining facial massage with Meadow Face Oil',
      ],
      category: 'facials',
    },
    {
      id: 'facial-2',
      title: 'Seilich Facial with Back Massage',
      slug: 'seilich-facial-back-massage',
      description: 'Combine a rejuvenating Seilich Botanicals facial with a relaxing 30-minute aromatherapy back massage for ultimate pampering.',
      image: '/images/treatments/seilich_botanicals_products.jpg',
      duration: '90 mins',
      price: '£55',
      keyFeatures: [
        'Herbal Tea wildflower inhalation bowl',
        '30 minute aromatherapy back massage',
        'Followed by 60 minute Seilich Botanicals Meadowsweet facial',
      ],
      category: 'facials',
    },
    {
      id: 'facial-3',
      title: "Neal's Yard Holistic Facial",
      slug: 'neals-yard-holistic-facial',
      description: "Achieve a radiant glow with this holistic facial using organic Neal's Yard products, including massage and a nourishing mask.",
      image: '/images/treatments/neals_yard_facial_products.jpg',
      duration: '60 mins',
      price: '£40',
      keyFeatures: [
        'Double cleanse',
        'Exfoliation',
        'Face, chest, neck & shoulder massage',
        'Mask application',
        'Finishing products using Neal\'s Yard',
      ],
      category: 'facials',
    },
    {
      id: 'facial-4',
      title: 'Express Facial',
      slug: 'express-facial',
      description: 'Refresh your skin quickly with this 30-minute express facial, including cleansing, exfoliation, and a mini massage.',
      image: '/images/treatments/young-woman-mask-face-relaxing-spa-salon_176420-7580.jpg',
      duration: '30 mins',
      price: '£25',
      keyFeatures: [
        'Double cleanse',
        'Exfoliation',
        'Mini massage',
        'Moisturiser',
      ],
      category: 'facials',
    },
     {
       id: 'facial-5',
       title: 'Luxury Facial & Back Massage',
       slug: 'luxury-facial-back-massage',
       description: 'Indulge in a 90-minute session combining a luxurious 60-minute facial with a relaxing back, neck, and shoulder massage.',
       image: '/images/treatments/cosmetologist-applying-mask-face-client-beauty-salon_1303-16777.avif',
       duration: '90 mins',
       price: '£50',
       keyFeatures: [
          '60 min facial',
          'Back, neck and shoulder massage',
       ],
       category: 'facials',
     },

    // Body Treatments
     {
       id: 'body-1',
       title: 'Back Cleanse',
       slug: 'back-cleanse',
       description: 'Deeply cleanse and purify your back with this treatment featuring exfoliation, a mask, foot massage, and back massage.',
       image: '/images/treatments/spa-concept-with-woman-massage_23-2147816926.jpg',
       duration: '45 mins',
       price: '£35',
       keyFeatures: [
          'Hot towel compress',
          'Invigorating scrub',
          'Application of mask to back',
          'Foot massage',
          'Followed by back, neck and shoulder massage',
       ],
       category: 'body-treatments',
     },
    {
      id: 'body-2',
      title: 'Head to Toe Treatment',
      slug: 'head-to-toe-treatment',
      description: 'Experience complete relaxation with this head-to-toe treatment including a back massage, express facial, and foot reflexology.',
      image: '/images/treatments/masseuse-doing-back-massage-with-skin-peeling-young-woman_1048944-1675079.jpg',
      duration: '90 mins',
      price: '£55',
      keyFeatures: [
        'Back, neck and shoulder massage',
        'Tailored express facial',
        'Followed by foot reflexology',
      ],
      category: 'body-treatments',
    },

    // Reflexology
    {
      id: 'reflexology-1',
      title: 'Reflexology',
      slug: 'reflexology',
      description: 'Restore balance and promote well-being through the ancient art of reflexology, targeting pressure points on the feet.',
      image: '/images/categories/person_having_reflexology_treatment.png',
      duration: '45 mins',
      price: '£30',
      keyFeatures: [
        'Reflexology movements',
        'Followed by relaxing foot massage',
      ],
      category: 'reflexology',
    },
    {
      id: 'reflexology-2',
      title: 'Deluxe Spa Reflexology',
      slug: 'deluxe-spa-reflexology',
      description: 'Indulge in the ultimate pampering with our Deluxe Spa Reflexology. This luxurious treatment combines exfoliation, a nourishing masque, and targeted reflexology to restore balance and leave your feet feeling completely rejuvenated.',
      image: '/images/treatments/spa_reflexology_treatment.jpg', // TODO: Replace with a better image
      duration: '70 mins',
      price: '£40',
      keyFeatures: [
        'Foot soak',
        'Exfoliation',
        'Foot masque with heated boots',
        'Hand massage',
        'Reflexology movements',
        'Relaxing foot massage',
        'Finished with cooling moisturiser',
      ],
      category: 'reflexology',
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

  // Use explicit Key: Value pairs for the icon map
  export const categoryIconMap: Record<string, LucideIcon> = {
    Sun: Sun,
    HandHelping: HandHelping,
    SmilePlus: SmilePlus,
    PersonStanding: PersonStanding,
    Footprints: Footprints,
  };