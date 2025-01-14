import { defineField } from 'sanity';

interface Options {
  name?: string;
  slug?: boolean;
  fieldset?: string;
}

export function titleFields(options: Options = {}) {
  const { name, slug, fieldset } = options;

  return [
    defineField({
      name: name || 'title',
      type: 'string',
      fieldset,
      validation: (rule) => rule.required(),
    }),
    ...(slug !== false
      ? [
          defineField({
            name: 'slug',
            type: 'slug',
            fieldset,
            options: { source: 'name' },
            validation: (rule) => rule.required(),
            hidden: ({ document }) => !document?.name,
          }),
        ]
      : []),
  ];
}

export const nameFields = (options?: Omit<Options, 'name'>) =>
  titleFields({
    ...options,
    name: 'name',
  });
