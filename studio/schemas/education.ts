import { defineField, defineType } from 'sanity';

import { dateField } from '@studio/schemas/common/fields/date';
import { titleFields } from '@studio/schemas/common/fields/title';
import { IconEducation } from '@studio/schemas/common/icons';

export const education = defineType({
  name: 'education',
  type: 'document',
  icon: IconEducation,
  fields: [
    ...titleFields({ name: 'qualification', slug: false }),
    defineField({
      name: 'institution',
      type: 'reference',
      to: [{ type: 'contact' }],
      options: {
        filter: 'type == $type',
        filterParams: { type: 'institution' },
      },
      validation: (rule) => rule.required(),
    }),
    dateField({
      name: 'from',
      validation: (rule) => rule.required(),
    }),
    dateField({
      name: 'to',
    }),
  ],
  orderings: [
    {
      title: 'Latest',
      name: 'fromDateDesc',
      by: [{ field: 'from', direction: 'desc' }],
    },
    {
      title: 'Oldest',
      name: 'fromDateAsc',
      by: [{ field: 'from', direction: 'asc' }],
    },
  ],
});
