import { defineArrayMember, defineField, defineType } from 'sanity';

import { nameFields } from '@studio/schemas/common/fields/title';
import { IconSkill } from '@studio/schemas/common/icons';

export const skill = defineType({
  name: 'skill',
  type: 'document',
  icon: IconSkill,
  fields: [
    ...nameFields({ slug: false }),
    defineField({
      name: 'root',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'subSkills',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'skill' }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      root: 'root',
    },
    prepare: (selection) => {
      const { title, root } = selection;
      return {
        title,
        subtitle: Boolean(root) ? 'Root' : undefined,
      };
    },
  },
  orderings: [
    {
      title: 'Root First',
      name: 'root',
      by: [
        { field: 'root', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
});
