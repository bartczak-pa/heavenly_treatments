import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'treatment',
  title: 'Treatment',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Full treatment description for SEO and engagement',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Treatment duration (e.g., "70 mins", "1 hour")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Price with currency symbol (e.g., "£50")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features or steps of the treatment',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Benefits of this treatment (shown in "The benefits" section). Falls back to Key Features if empty.',
    }),
    defineField({
      name: 'whatToExpect',
      title: 'What to Expect (Steps)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Step Title', type: 'string' }),
            defineField({ name: 'description', title: 'Step Description', type: 'text' }),
          ],
        },
      ],
      description: 'Step-by-step walkthrough of the treatment. Falls back to generic steps if empty.',
    }),
    defineField({
      name: 'whatIsIncluded',
      title: 'What\'s Included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of what is included in this treatment (shown in the booking aside). Falls back to Key Features if empty.',
    }),
    defineField({
      name: 'goodFor',
      title: 'Good For',
      type: 'text',
      description: 'Who or what this treatment is good for (shown in the booking aside). Falls back to first sentence of description if empty.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'freshaUrl',
      title: 'Fresha Booking URL (Dedicated)',
      type: 'url',
      description: 'Direct Fresha booking link for this specific treatment. Optional - will fallback to general Fresha URL if empty.',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'devOnly',
      title: 'Dev Only',
      type: 'boolean',
      description: '⚠️ When enabled, this treatment is hidden from the live site and only visible in development. Use this while building out new treatments before they are ready to go live.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'image',
      category: 'category.name',
      devOnly: 'devOnly',
    },
    prepare(selection) {
      const { title, subtitle, media, category, devOnly } = selection;
      return {
        title: devOnly ? `[DEV] ${title}` : title,
        subtitle: `${category} - ${subtitle}`,
        media,
      };
    },
  },
});
