import { nameFields } from '@studio/schemas/common/fields/title';

import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  type: 'document',
  fields: [
    ...nameFields(),
    defineField({
      name: 'description',
      type: 'number',
    }),
  ],
});
