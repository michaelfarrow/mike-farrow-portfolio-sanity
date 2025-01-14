import { defineField, defineType } from 'sanity';
import { nameFields } from './common/fields/title';

export const category = defineType({
  name: 'category',
  type: 'document',
  fields: [
    ...nameFields(),
    defineField({
      name: 'description',
      type: 'string',
    }),
  ],
});
