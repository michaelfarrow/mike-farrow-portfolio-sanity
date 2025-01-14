import { defineField, defineType } from 'sanity';
import { nameFields } from './common/fields/title';

export const link = defineType({
  name: 'link',
  type: 'document',
  fields: [
    ...nameFields({ slug: false }),
    defineField({
      name: 'shortName',
      type: 'string',
    }),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
  ],
});
