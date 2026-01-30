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
    description: string; // TODO: Refine descriptions for better SEO and engagement.
    image: string; // Relative path to the image in /public
    imageWidth?: number; // Optional: Add actual image width
    imageHeight?: number; // Optional: Add actual image height
    duration: string;
    price: string;
    keyFeatures?: string[]; // Optional array of key features
    category: TreatmentCategorySlug; // Link to the category
    freshaUrl?: string; // Optional Fresha booking URL (dedicated to this treatment)
  }
  
  /**
   * Represents the different categories of treatments.
   */
  export interface TreatmentCategory {
    id: string;
    slug: TreatmentCategorySlug;
    name: string;
    image: string; // Relative path to the image in /public
    description: string; // TODO: Refine descriptions for better SEO and engagement.
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
      shortDescription: 'Melt away tension with my range of massages',
      image: '/images/categories/woman-with-closed-eyes-enjoying-massage.jpg',
      iconName: 'HandHelping',
    },
    {
      id: 'cat-3',
      slug: 'facials',
      name: 'Facials',
      description: 'Nourish and pamper your body from head to toe.',
      shortDescription: 'Achieve glowing skin with my facial treatments',
      image: '/images/optimized/woman-salon-making-beauty-treatment-with-gua-sha-stone.webp',
      iconName: 'SmilePlus',
    },
    {
      id: 'cat-4',
      slug: 'body-treatments',
      name: 'Body Treatments',
      description: 'Nourish and pamper your body from head to toe.',
      shortDescription: 'Nourish and pamper your body from head to toe.',
      image: '/images/categories/woman-having-body-treatment.jpg',
      iconName: 'PersonStanding',
    },
    {
      id: 'cat-5',
      slug: 'reflexology',
      name: 'Reflexology',
      description: 'Relax and rejuvenate with my range of reflexology treatments.',
      shortDescription: 'Heal from within with reflexology treatments',
      image: '/images/optimized/person_having_reflexology_treatment.webp',
      iconName: 'Footprints',
    },
  ];
  

  export const allTreatments: Treatment[] = [

    // Seasonal Treatments
    {
      id: 'holistic-1',
      title: 'Scrub & Soothe',
      slug: 'scrub-soothe',
      // SEO Description
      description: 'Indulge in a full-body seasonal treat featuring a warm pumpkin pie spice scrub, massage, and pampering for hands and feet.',
      image: '/images/treatments/products_used_for_pumpkin_pie_pamper.jpg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '70 mins',
      price: '£50',
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
      id: 'holistic-2',
      title: 'Heal & Glow',
      slug: 'heal-glow',
      // SEO Description
      description: 'Indulge in a holistic treatment for your mind, body and soul using beautiful handmade products from Wild & Wood.',
      image: '/images/treatments/heal_and_glow.jpeg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '70 mins',
      price: '£45',
      keyFeatures: [
        'Mini Facials with oil cleanse and sugar scrub',
        'Healing balm facial massage',
        'Facial mask',
        'Foot massage with heated booties',
        'Hand massage',
        'Scalp massage',
        'Botanical facial oil',
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
      imageWidth: 800,
      imageHeight: 600,
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
      imageWidth: 800,
      imageHeight: 600,
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
      imageWidth: 800,
      imageHeight: 600,
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
      title: 'Back Facial',
      slug: 'back-facial',
      description: 'Purify and relax with a back treatment including exfoliation, a mask application, and a soothing massage.',
      image: '/images/treatments/spa-concept-with-woman-massage_23-2147816926.jpg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '50 mins',
      price: '£35',
      keyFeatures: [
        'Hot cloth exfoliation on the back',
        'Scrub application',
        'Masque application to the back',
        'Followed by massage',
      ],
      category: 'massages',
    },

    // Massages - Aromatherapy
    {
      id: 'massage-5',
      title: 'Sleep Well Treatment',
      slug: 'sleep-well-treatment',
      description: 'Promote restful sleep with this calming treatment featuring lavender aromatherapy massage, hot compresses, and a relaxing scalp massage.',
      image: '/images/treatments/young-woman-relaxing-spa-salon_176420-7531.jpg',
      imageWidth: 800,
      imageHeight: 600,
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
      title: 'Hydrating Jelly Mask Facial',
      slug: 'hydrating-jelly-mask-facial',
      description: 'Indulgent facial to leave your skin glowing and help to achieve the glass skin look.',
      image: '/images/treatments/woman_having_jelly_mask.jpeg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '70 mins',
      price: '£45',
      keyFeatures: [
        'Creamy Cleanse',
        'Foaming Vitamin C Cleanse',
        'Calming Exfoliation',
        'Facial Massage with Lymphatic Drainage',
        'Massage with Jade and Ice Rollers',
        'JellyLab Jelly Mask',
        'Chest, Neck and Shoulder Massage',
        'Hand Massage',
        'Energising Under Eye Mask',
        'Scalp Massage with Jade Combs',
        'Serum & Moisturiser',
      ],
      category: 'facials',
    },
    {
      id: 'facial-2',
      title: 'Seilich Botanicals Meadowsweet Facial',
      slug: 'seilich-meadowsweet-facial',
      description: 'Experience a luxurious facial using meadow-grown Seilich Botanicals products from Scotland, leaving your skin nourished and revitalized.',
      image: '/images/treatments/seilich_botanicals_products.jpg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '60 mins',
      price: '£40',
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
      id: 'facial-3',
      title: 'Seilich Facial with Back Massage',
      slug: 'seilich-facial-back-massage',
      description: 'Combine a rejuvenating Seilich Botanicals facial with a relaxing 30-minute aromatherapy back massage for ultimate pampering.',
      image: '/images/treatments/seilich_botanicals_products.jpg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '90 mins',
      price: '£50',
      keyFeatures: [
        'Herbal Tea wildflower inhalation bowl',
        '30 minute aromatherapy back massage',
        'Followed by 60 minute Seilich Botanicals Meadowsweet facial',
      ],
      category: 'facials',
    },
    {
      id: 'facial-4',
      title: "Signature Facial",
      slug: 'signature-facial',
      description: "Achieve a radiant glow with this holistic facial using organic Neal's Yard products, including massage and a nourishing mask.",
      image: '/images/treatments/neals_yard_facial_products.jpg',
      imageWidth: 800,
      imageHeight: 600,
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
      id: 'facial-5',
      title: 'Express Facial',
      slug: 'express-facial',
      description: 'Refresh your skin quickly with this 30-minute express facial, including cleansing, exfoliation, and a mini massage.',
      image: '/images/treatments/young-woman-mask-face-relaxing-spa-salon_176420-7580.jpg',
      imageWidth: 800,
      imageHeight: 600,
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
       id: 'facial-6',
       title: 'Signature Facial & Back Massage',
       slug: 'signature-facial-back-massage',
       description: 'Indulge in a 90-minute session combining a luxurious 60-minute facial with a relaxing back, neck, and shoulder massage.',
       image: '/images/treatments/cosmetologist-applying-mask-face-client-beauty-salon_1303-16777.avif',
       imageWidth: 800,
       imageHeight: 600,
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
       imageWidth: 800,
       imageHeight: 600,
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
      imageWidth: 800,
      imageHeight: 600,
      duration: '90 mins',
      price: '£55',
      keyFeatures: [
        'Back, neck and shoulder massage',
        'Tailored express facial',
        'Followed by foot reflexology',
      ],
      category: 'body-treatments',
    },
    {
      id: 'body-3',
      title: 'Fruity Bacial & Express Calming Facial',
      slug: 'fruity-bacial-express-calming-facial',
      description: 'This 90min treatment includes a sugar exfoliation on the back, a Mango Firming Body Mask on the back and décolleté to absorb excess oil and improve skin texture followed by a relaxing massage and mini facial. Perfect to prepare your skin for summer!',
      image: '/images/optimized/bacial.webp',
      imageWidth: 800,
      imageHeight: 600,
      duration: '90 mins',
      price: '£50',
      keyFeatures: [
        'Sugar back scrub to exfoliate and energise',
        'Mango Firming mask to detoxify and deep cleanse',
        'Foot and lower leg massage',
        'Mini facial with double cleanse and exfoliation',
        'Firming mask on décolleté and calming facial mask',
        'Scalp and hand massage while the masks get to work',
        'Finish with serum and moisturiser',
      ],
      category: 'body-treatments',
    },
    {
      id: 'body-4',
      title: 'Botanical Dry Head Spa with Mini Facial',
      slug: 'botanical-dry-head-spa-with-mini-facial',
      description: 'Want all the relaxing benefits of a head spa without getting your hair wet then this might be the treatment for you! This treatment is deeply relaxing and can promote a good nights sleep as well as relief from headaches and stress. ',
      
      image: '/images/treatments/dry_head_spa.jpg',
      imageWidth: 800,
      imageHeight: 600,
      duration: '60 mins',
      price: '£45',
      keyFeatures: [
        'Meadow blend tea inhalation bowl',
        'Dry body brush of neck and shoulders',
        'Neck and shoulder massage',
        'Sensory massage of shoulders and scalp using tools and combs',
        'Continuation of scalp massage',
        'Mini Seilich Botanicals facial ~ double cleanse, tone and moisturise',
        'Facial massage with lymphatic drainage and jade rollers using meadow face oil',
        '£45 for 60mins or £55 to include full Botanical facial (90mins)',
      ],
      category: 'body-treatments',
    },
    

    // Reflexology
    {
      id: 'reflexology-1',
      title: 'Reflexology',
      slug: 'reflexology',
      description: 'Restore balance and promote well-being through the ancient art of reflexology, targeting pressure points on the feet.',
      image: '/images/optimized/person_having_reflexology_treatment.webp',
      imageWidth: 800,
      imageHeight: 600,
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
      imageWidth: 800,
      imageHeight: 600,
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
   * Constructs the URL path for a treatment detail page.
   * @param treatment - Treatment with category and slug properties.
   * @returns The treatment detail page path.
   */
  export const getTreatmentPath = (treatment: Pick<Treatment, 'category' | 'slug'>): string => {
    return `/treatments/${treatment.category}/${treatment.slug}`;
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