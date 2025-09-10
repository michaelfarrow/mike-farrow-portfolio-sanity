import { FieldOptions } from '@studio/schemas/common/fields/field';
import { markdownField } from '@studio/schemas/common/fields/markdown';
import { IconDocumentText } from '@studio/schemas/common/icons';
import { MarkdownPreview } from '@studio/schemas/previews/markdown';

import { defineField } from 'sanity';

export function markdownObjectField(options: FieldOptions) {
  const { ...rest } = options;

  return defineField({
    ...rest,
    type: 'object',
    icon: IconDocumentText,
    fields: [markdownField({ name: 'content' })],
    preview: {
      select: {
        content: 'content',
      },
      prepare: (selection) => ({ ...selection, title: 'Markdown' }),
    },
    components: {
      preview: MarkdownPreview,
    },
  });
}
