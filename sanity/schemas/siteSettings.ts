import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'freshaGeneralUrl',
      title: 'Fresha General Booking URL',
      type: 'url',
      description: 'General Fresha URL used as fallback when dedicated treatment URLs are not set',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
  ],
});
