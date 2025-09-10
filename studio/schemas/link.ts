import { nameFields } from '@studio/schemas/common/fields/title';
import { IconLink } from '@studio/schemas/common/icons';

import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  type: 'document',
  icon: IconLink,
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
  preview: {
    select: {
      title: 'name',
      subtitle: 'url',
    },
  },
});
