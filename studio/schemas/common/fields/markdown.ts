import { FieldOptions } from '@studio/schemas/common/fields/field';
import { MarkdownInput } from '@studio/schemas/inputs/markdown';

import { defineField } from 'sanity';

export function markdownField(options: FieldOptions) {
  const { ...rest } = options;

  return defineField({
    ...rest,
    type: 'markdown',
    components: {
      input: MarkdownInput,
    },
  });
}
