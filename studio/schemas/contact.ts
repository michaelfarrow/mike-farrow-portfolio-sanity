import { nameFields } from '@studio/schemas/common/fields/title';
import {
  IconCompany,
  IconContact,
  IconIndividual,
  IconInstitution,
  IconUnknown,
} from '@studio/schemas/common/icons';
import { titleCase } from 'title-case';

import { defineField, defineType } from 'sanity';

const ICON_MAP = {
  individual: IconIndividual,
  company: IconCompany,
  institution: IconInstitution,
};

export const contact = defineType({
  name: 'contact',
  type: 'document',
  icon: IconContact,
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
  orderings: [
    {
      title: 'Type',
      name: 'type',
      by: [{ field: 'type', direction: 'desc' }],
    },
    {
      title: 'Name',
      name: 'name',
      by: [{ field: 'name', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      type: 'type',
      subtitle: 'type',
    },
    prepare: (selection) => ({
      ...selection,
      subtitle: selection.subtitle && titleCase(selection.subtitle),
      media: (ICON_MAP as any)[selection.type] || IconUnknown,
    }),
  },
});
