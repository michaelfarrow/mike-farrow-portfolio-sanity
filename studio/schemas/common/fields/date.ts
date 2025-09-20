import { DateDefinition, defineField } from 'sanity';

import type { CustomFieldOptions } from '@studio/schemas/common/fields/field';

export function dateField({
  options,
  ...rest
}: CustomFieldOptions<
  DateDefinition,
  null,
  {
    text?: boolean;
    images?: boolean;
    videos?: boolean;
    columns?: boolean;
  }
>) {
  return defineField({
    ...rest,
    type: 'date',
    options: {
      dateFormat: 'DD/MM/YYYY',
      ...options,
    },
  });
}
