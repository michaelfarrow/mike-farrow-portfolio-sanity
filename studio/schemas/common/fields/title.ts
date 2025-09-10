import { FieldOptions } from '@studio/schemas/common/fields/field';
import { SetOptional } from 'type-fest';

import { defineField } from 'sanity';

interface TitleFieldOptions extends SetOptional<FieldOptions, 'name'> {
  slug?: boolean;
}

export function titleFields({
  slug,
  name,
  fieldset,
  group,
  ...rest
}: TitleFieldOptions = {}) {
  const common = {
    fieldset,
    group,
  };

  return [
    defineField({
      ...rest,
      ...common,
      type: 'string',
      name: name || 'title',
      validation: (rule) => rule.required(),
    }),
    ...(slug !== false
      ? [
          defineField({
            ...common,
            type: 'slug',
            name: 'slug',
            options: { source: 'name' },
            validation: (rule) => rule.required(),
            hidden: ({ document }) => !document?.name,
          }),
        ]
      : []),
  ];
}

export const nameFields = (options?: Omit<TitleFieldOptions, 'name'>) =>
  titleFields({
    ...options,
    name: 'name',
  });
