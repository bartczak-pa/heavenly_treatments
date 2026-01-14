/**
 * @fileoverview SEO Content Data
 *
 * Contains all SEO-optimized content for category and treatment pages.
 * This data is used to enhance page content with introductions and FAQs
 * for better search engine visibility and user engagement.
 *
 * @author Claude Code
 * @version 1.0.0
 */

/**
 * Interface for category SEO content
 */
export interface CategorySEOContent {
  slug: string;
  introTitle: string;
  introParagraphs: string[];
  faqs: { question: string; answer: string }[];
}

/**
 * SEO content for each treatment category
 * Keys match category slugs from the CMS
 */
export const categorySEOContent: Record<string, CategorySEOContent> = {
  massages: {
    slug: 'massages',
    introTitle: 'Professional Massage Treatments in Kelso',
    introParagraphs: [
      "Experience the healing power of touch with my range of professional massage treatments in Kelso. Whether you're seeking relief from tension, stress reduction, or pure relaxation, my massage therapies are tailored to your individual needs.",
      'From Swedish full body massage to targeted back, neck and shoulders treatments, we offer therapies suitable for everyone. Each massage incorporates premium aromatherapy oils selected for their therapeutic benefits.',
      "Ready to relax? Browse my massage treatments below and book your appointment today. Located in a peaceful cottage spa setting in the Scottish Borders.",
    ],
    faqs: [
      {
        question:
          "What's the difference between Swedish massage and other massage types?",
        answer:
          "Swedish massage uses gentle, flowing strokes and kneading techniques to relax muscles and improve circulation. It's ideal for general relaxation and stress relief. At Heavenly Treatments, I customize Swedish massage to your needs, or recommend specialized options based on your goals.",
      },
      {
        question: 'How often should I get a massage for health benefits?',
        answer:
          "This depends on your goals. For stress relief and wellness, monthly or bi-monthly treatments are ideal. If you're managing specific pain or tension, weekly sessions might be recommended initially. Many clients find that even one massage per month makes a noticeable difference in their overall well-being.",
      },
      {
        question: 'Is massage good for muscle tension from desk work?',
        answer:
          'Yes, absolutely. Desk work creates specific tension patterns - tight neck, shoulders, and lower back are common complaints. My back, neck and shoulder massage specifically targets these problem areas. Regular sessions prevent the tension from building up.',
      },
      {
        question: 'What should I expect during and after a massage?',
        answer:
          'During your massage, you should feel progressive relaxation. After your massage, you may feel deeply relaxed, slightly sleepy, or energized. Drink water afterward to support circulation. Some clients experience improved sleep that night.',
      },
      {
        question: 'Can I combine massage with other treatments?',
        answer:
          'Yes! Many of my most popular treatments combine massage with other therapies. Examples include Swedish massage paired with an express facial, back massage with reflexology, or specialized packages. These combination treatments provide comprehensive relaxation.',
      },
    ],
  },
  facials: {
    slug: 'facials',
    introTitle: 'Premium Facial Treatments in Kelso',
    introParagraphs: [
      "Achieve that coveted glowing, healthy skin with my range of professional facial treatments in Kelso. From hydrating jelly mask facials to organic botanical treatments, each facial is customized to address your skin's unique needs.",
      "I use only premium, high-quality products including organic Neal's Yard and Seilich Botanicals featuring meadow-grown Scottish ingredients. Every facial includes face, neck, chest and shoulder massage for complete relaxation.",
      'Ready for radiant, glowing skin? Explore my facial menu below or book your appointment at my Kelso cottage spa.',
    ],
    faqs: [
      {
        question: "What's the difference between your facial options?",
        answer:
          "I offer several facial types:\n\nExpress Facial (30 mins) - Perfect for quick skin refresh.\n\nSignature Facial (60 mins) - Uses organic Neal's Yard products with deeper massage.\n\nSeilich Meadowsweet Facial (60 mins) - Features Scottish-grown botanical ingredients.\n\nHydrating Jelly Mask Facial (70 mins) - My premium option with jade roller massage for the glass skin effect.",
      },
      {
        question: 'Which facial is best for dry/oily/sensitive skin?',
        answer:
          'Dry skin: Hydrating Jelly Mask Facial or Seilich Facial for intense hydration.\n\nOily skin: Signature Facial works well.\n\nSensitive skin: Seilich Facial uses gentle botanicals.\n\nAll my facials are customizable during consultation.',
      },
      {
        question: 'Will a facial help with acne or anti-aging concerns?',
        answer:
          'Yes. Professional facials address both concerns effectively.\n\nFor acne: Exfoliation removes dead skin, masks extract impurities.\n\nFor anti-aging: Massage stimulates collagen production, masks deliver deep hydration.\n\nResults compound with regular treatments.',
      },
      {
        question: 'Can I get a facial if I have sensitive skin or allergies?',
        answer:
          "Absolutely. I work with sensitive skin regularly. Let me know about any allergies or sensitivities before your appointment. All my products are either organic (Neal's Yard) or botanical (Seilich), which many sensitive-skin clients prefer.",
      },
      {
        question: 'How long before I see results from facials?',
        answer:
          "You'll see immediate results - skin looks fresher, plumper, and more radiant right after treatment. For deeper concerns like acne or fine lines, results develop over 3-4 weeks with regular treatments.",
      },
    ],
  },
  reflexology: {
    slug: 'reflexology',
    introTitle: 'Reflexology Treatments in Kelso',
    introParagraphs: [
      "Reflexology is an ancient healing practice that promotes balance and well-being through targeted pressure points on the feet. At Heavenly Treatments cottage spa in Kelso, I use reflexology to support your body's natural healing processes.",
      'Your feet contain reflex points that correspond to every body system. By applying specific techniques, reflexology stimulates circulation, reduces tension, and encourages your body to restore balance.',
      'Choose my classic Reflexology (45 mins) for focused treatment, or upgrade to Deluxe Spa Reflexology (70 mins) for the full spa experience including exfoliation, nourishing masque, and hand massage.',
    ],
    faqs: [
      {
        question: 'Is reflexology the same as a foot massage?',
        answer:
          "While both are relaxing, they're different techniques. Foot massage focuses on relaxing foot muscles. Reflexology uses specific hand techniques to stimulate reflex points that correspond to your entire body - organs, glands, and systems. Both my reflexology treatments include foot massage as part of the experience.",
      },
      {
        question: 'What health benefits does reflexology provide?',
        answer:
          'Reflexology supports:\n• Improved circulation\n• Better sleep quality\n• Stress and anxiety reduction\n• Digestive support\n• Hormonal balance\n• Immune system boost\n\nMany clients report relief from headaches, sinus congestion, or PMS symptoms.',
      },
      {
        question: 'How often should I get reflexology?',
        answer:
          'For general wellness and stress relief, monthly reflexology is ideal. If addressing specific concerns like sleep issues or hormonal balance, bi-weekly sessions are more effective initially, then monthly maintenance.',
      },
      {
        question:
          "What's the difference between standard Reflexology and Deluxe Spa Reflexology?",
        answer:
          'Standard Reflexology (45 mins, £30) - Focuses on reflexology techniques with foot massage.\n\nDeluxe Spa Reflexology (70 mins, £40) - Includes foot soak, exfoliation, nourishing foot masque with heated booties, hand massage, AND reflexology. It\'s the full pampering experience.',
      },
      {
        question:
          'Is reflexology safe? Are there any health conditions I should mention?',
        answer:
          "Reflexology is safe for most people. However, tell me before your appointment if you have pregnancy, foot injuries, blood clots, or serious health conditions. I'll modify the treatment as needed.",
      },
    ],
  },
  'body-treatments': {
    slug: 'body-treatments',
    introTitle: 'Body Treatments in Kelso',
    introParagraphs: [
      'Indulge in my luxurious body treatments designed to rejuvenate and pamper from head to toe. My body treatments in Kelso combine therapeutic techniques with premium products for complete body renewal.',
      'From back treatments to full body experiences, each therapy is tailored to your specific needs and preferences in my private cottage spa setting.',
    ],
    faqs: [
      {
        question: 'What body treatments do you offer?',
        answer:
          'I offer a range of body treatments including back treatments, body exfoliation, and combination packages. Each treatment can be customized to address your specific concerns and preferences.',
      },
      {
        question: 'Can body treatments be combined with massage or facials?',
        answer:
          'Absolutely! Many clients love combining body treatments with massage or facials for a complete pampering experience. Ask about my combination packages for the best value.',
      },
    ],
  },
  'holistic-treatments': {
    slug: 'holistic-treatments',
    introTitle: 'Holistic Treatments in Kelso',
    introParagraphs: [
      'Discover my range of holistic treatments designed to restore balance and promote overall wellness. My holistic therapies in Kelso address mind, body, and spirit for complete rejuvenation.',
      'Experience unique treatments like the Botanical Dry Head Spa or combine multiple therapies for a comprehensive wellness journey in my peaceful cottage spa setting.',
    ],
    faqs: [
      {
        question: "What makes a treatment 'holistic'?",
        answer:
          'Holistic treatments address the whole person - mind, body, and spirit - rather than just physical symptoms. These therapies work to restore balance and promote natural healing processes.',
      },
      {
        question: 'Who benefits most from holistic treatments?',
        answer:
          'Anyone seeking deeper relaxation, stress relief, or a more comprehensive wellness approach. Holistic treatments are particularly beneficial for those dealing with chronic stress, anxiety, or seeking preventative wellness care.',
      },
    ],
  },
};

/**
 * Interface for treatment-specific FAQ content
 */
export interface TreatmentFAQ {
  treatmentSlug: string;
  faqs: { question: string; answer: string }[];
}

/**
 * Treatment-specific FAQ content for treatment detail pages
 * Keys match treatment slugs from the CMS
 */
export const treatmentFAQs: Record<string, TreatmentFAQ> = {
  'swedish-full-body-massage': {
    treatmentSlug: 'swedish-full-body-massage',
    faqs: [
      {
        question:
          'How is Swedish massage different from deep tissue or other styles?',
        answer:
          'Swedish massage is gentler than deep tissue but highly effective. While deep tissue uses intense pressure on specific problem areas, Swedish uses moderate pressure with flowing, rhythmic strokes across larger muscle groups. This makes Swedish ideal for relaxation, stress relief, and general wellness.',
      },
      {
        question: 'How long should a Swedish massage be for best results?',
        answer:
          "60 minutes (full body) is ideal - allows time for warm-up, deep work, and integration. I work your entire body systematically from feet to head. If you're time-limited, my 30-minute back/neck option is a solid alternative for focused relief.",
      },
      {
        question: 'Will Swedish massage help with my back pain?',
        answer:
          'Swedish massage is excellent for back pain relief. It improves circulation, releases muscle tension (often the cause of back pain), and reduces stress which tightens muscles. Regular Swedish massage can help prevent pain from returning.',
      },
      {
        question: 'Is Swedish massage relaxing or can it hurt?',
        answer:
          "Swedish massage should feel relaxing. The pressure is firm but not painful. Some mild discomfort is normal if your muscles are very tense. If anything hurts, speak up - I'll reduce pressure. You should feel progressive relaxation as the massage continues.",
      },
      {
        question: 'How often should I get Swedish massage for best results?',
        answer:
          'For stress relief and general wellness: monthly is ideal. For pain management: bi-weekly or weekly initially, then monthly maintenance. Consistency matters; regular treatments provide better results than sporadic ones.',
      },
      {
        question: 'What should I do before and after my massage?',
        answer:
          'Before: Eat lightly, drink water, arrive 10 minutes early. After: Rest briefly before driving, drink plenty of water, avoid strenuous activity. Light soreness is normal; gentle stretching helps.',
      },
    ],
  },
  'hydrating-jelly-mask-facial': {
    treatmentSlug: 'hydrating-jelly-mask-facial',
    faqs: [
      {
        question: 'What makes this facial special?',
        answer:
          "The JellyLab Jelly Mask is the star ingredient. Unlike traditional masks, the hydrating jelly penetrates all skin layers for that glass skin effect. This 70-minute facial includes 10 steps: double cleanse, exfoliation, facial massage with lymphatic drainage, jade and ice roller massage, the jelly mask treatment, chest/neck/shoulder massage, hand massage, under-eye mask, jade comb scalp massage, and serum/moisturizer finish.",
      },
      {
        question: 'Is the jelly mask safe for sensitive skin?',
        answer:
          'The JellyLab formula is designed to be gentle even on reactive skin - free from common irritants. If you have very sensitive skin, mention this before your appointment. Most sensitive-skin clients love this facial and the results.',
      },
      {
        question: 'How long do the results last?',
        answer:
          "Immediate results (glow, radiance, plumpness) peak at 24 hours and last about 5-7 days. For maintained radiance, monthly facials are ideal. Many clients book this before special events - schedule 1-2 days before for peak effect.",
      },
      {
        question: 'Can I do this facial if I have acne-prone skin?',
        answer:
          "Yes, with customization. Deep hydration actually helps acne-prone skin. I'll adjust product layering on active acne areas. The lymphatic drainage massage and exfoliation support clear skin. Mention acne during your consultation.",
      },
      {
        question: 'Why is this facial more expensive than others?',
        answer:
          "This facial is only £5 more than standard facials but includes premium JellyLab products, extra time (70 mins vs 60), and additional techniques like jade roller work, ice roller massage, and under-eye mask. Most clients say it's the most noticeable facial transformation they've experienced.",
      },
    ],
  },
  'deluxe-spa-reflexology': {
    treatmentSlug: 'deluxe-spa-reflexology',
    faqs: [
      {
        question: 'Is the deluxe reflexology worth the extra £10?',
        answer:
          'Absolutely, especially if you have dry/rough feet or want maximum relaxation. The extra time (70 vs 45 mins) allows for full body relaxation plus foot cosmetic care. The foot masque with heated booties creates a luxurious spa experience. You emerge with softer feet and deeper relaxation.',
      },
      {
        question:
          'Will the foot soak and exfoliation affect my skin or nail health?',
        answer:
          'Both are beneficial. Warm water soaks soften skin, preparing for gentle exfoliation which removes dead skin safely. Regular exfoliation improves skin quality - feet become smoother, softer, healthier-looking. The foot masque is nourishing and hydrating.',
      },
      {
        question: 'How often should I get deluxe reflexology?',
        answer:
          'Monthly deluxe reflexology is ideal for maintaining foot health and wellness benefits. The foot care becomes most visible with consistency - after 3-4 monthly treatments, your feet look noticeably healthier.',
      },
      {
        question:
          'Can I do this if I have foot problems like bunions or plantar fasciitis?',
        answer:
          "Yes, but I'll customize. Tell me about any foot conditions beforehand. I'll modify exfoliation and foot work to avoid problem areas while treating surrounding tissue. Reflexology can actually support healing by improving circulation.",
      },
      {
        question:
          "What's the best schedule - standalone or with other treatments?",
        answer:
          "Deluxe reflexology works beautifully standalone. Some clients combine it with massage or facial for a full pampering day. If combining, schedule massage first, then reflexology. You'll feel so relaxed afterward - take your time before driving.",
      },
    ],
  },
};

/**
 * Helper function to get category SEO content by slug
 */
export function getCategorySEOContent(
  slug: string
): CategorySEOContent | null {
  return categorySEOContent[slug] || null;
}

/**
 * Helper function to get treatment FAQ content by slug
 */
export function getTreatmentFAQContent(slug: string): TreatmentFAQ | null {
  return treatmentFAQs[slug] || null;
}
