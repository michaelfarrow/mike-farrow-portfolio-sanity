import { defineField, defineType } from 'sanity';

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{ type: 'artist' }],
    }),
  ],
});
