import { defineField, defineType } from 'sanity';

import { nameFields } from '@studio/schemas/common/fields/title';
import { IconCategory } from '@studio/schemas/common/icons';

export const category = defineType({
  name: 'category',
  type: 'document',
  icon: IconCategory,
  fields: [
    ...nameFields(),
    defineField({
      name: 'description',
      type: 'number',
    }),
  ],
});
