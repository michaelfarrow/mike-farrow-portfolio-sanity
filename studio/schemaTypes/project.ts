import { defineField, defineType } from 'sanity';
import { nameFields } from './common/fields/title';

export const project = defineType({
  name: 'project',
  type: 'document',
  fieldsets: [
    {
      name: 'details',
    },
    {
      name: 'content',
    },
    {
      name: 'links',
    },
    {
      name: 'settings',
    },
  ],
  fields: [
    ...nameFields({
      fieldset: 'details',
    }),
    defineField({
      name: 'date',
      type: 'date',
      fieldset: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      type: 'array',
      fieldset: 'details',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'description',
      type: 'text',
      fieldset: 'content',
      rows: 5,
    }),
    defineField({
      name: 'client',
      type: 'reference',
      fieldset: 'links',
      to: [{ type: 'contact' }],
    }),
    defineField({
      name: 'attributions',
      type: 'array',
      fieldset: 'links',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
            }),
            defineField({
              name: 'contacts',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'contact' }],
                },
              ],
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'hideFromSearchEngines',
      type: 'boolean',
      fieldset: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'private',
      type: 'boolean',
      fieldset: 'settings',
      initialValue: false,
    }),
  ],
});
