import { defineField, defineType } from 'sanity';
import { nameFields } from './common/fields/title';

export const contact = defineType({
  name: 'contact',
  type: 'document',
  fields: [
    ...nameFields({ slug: false }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: ['company', 'individual', 'institution'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      type: 'reference',
      to: [{ type: 'link' }],
    }),
  ],
});
