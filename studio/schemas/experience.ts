import { defineField, defineType } from 'sanity';

import { dateField } from '@studio/schemas/common/fields/date';
import { titleFields } from '@studio/schemas/common/fields/title';
import { IconExperience } from '@studio/schemas/common/icons';

export const experience = defineType({
  name: 'experience',
  type: 'document',
  icon: IconExperience,
  fields: [
    ...titleFields({ slug: false }),
    defineField({
      name: 'employer',
      type: 'reference',
      to: [{ type: 'contact' }],
      options: {
        filter: 'type != $type',
        filterParams: { type: 'individual' },
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
    defineField({
      name: 'description',
      type: 'text',
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
