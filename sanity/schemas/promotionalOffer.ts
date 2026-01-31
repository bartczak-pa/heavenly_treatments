import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'promotionalOffer',
  title: 'Promotional Offer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Dialog heading shown to visitors',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Offer body text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Optional promotional image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const parent = context.parent as { asset?: unknown };
              if (parent?.asset && !alt) {
                return 'Alt text is required when an image is provided';
              }
              return true;
            }),
        },
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Call-to-action button label (e.g. "Book Now")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'url',
      description: 'CTA destination URL (supports relative paths like /contact)',
      validation: (Rule) =>
        Rule.required().uri({
          allowRelative: true,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Enable or disable this promotional offer',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((isActive, context) => {
          if (!isActive) return true;
          const { endDate } = context.document as { endDate?: string };
          if (endDate && new Date(endDate) < new Date()) {
            return 'Warning: This offer is active but the end date is in the past';
          }
          return true;
        }),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'Optional: scheduled visibility start',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'Optional: scheduled expiry',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const { startDate } = context.document as { startDate?: string };
          if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            return 'End date must be after start date';
          }
          return true;
        }),
    }),
    defineField({
      name: 'dismissDurationDays',
      title: 'Dismiss Duration (Days)',
      type: 'number',
      description:
        'How many days to suppress the dialog after a user dismisses it',
      initialValue: 7,
      validation: (Rule) => Rule.required().min(1).max(365),
    }),
    defineField({
      name: 'displayDelaySeconds',
      title: 'Display Delay (Seconds)',
      type: 'number',
      description: 'Delay in seconds before showing the dialog',
      initialValue: 3,
      validation: (Rule) => Rule.required().min(0).max(30),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      media: 'image',
    },
    prepare(selection) {
      const { title, isActive, media } = selection;
      return {
        title,
        subtitle: isActive ? 'Active' : 'Inactive',
        media,
      };
    },
  },
});
