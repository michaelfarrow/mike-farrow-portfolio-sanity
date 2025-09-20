import { SetOptional } from 'type-fest';

import { StringDefinition, defineField } from 'sanity';

import {
  type CustomFieldOptions,
  extendValidation,
} from '@studio/schemas/common/fields/field';

export type TitleFieldsOptions = SetOptional<
  CustomFieldOptions<StringDefinition, null, { slug?: boolean }>,
  'name'
>;

export function titleFields({
  slug,
  name,
  group,
  fieldset,
  validation,
  ...rest
}: TitleFieldsOptions) {
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
      validation: extendValidation(validation, (rule) => rule.required()),
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

export const nameFields = (options?: Omit<TitleFieldsOptions, 'name'>) =>
  titleFields({
    ...options,
    name: 'name',
  });
