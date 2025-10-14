import { defineField, defineType } from 'sanity';

import { IconSettings } from '@studio/schemas/common/icons';

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: IconSettings,
  fields: [
    defineField({
      name: 'password',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Settings' }),
  },
});
