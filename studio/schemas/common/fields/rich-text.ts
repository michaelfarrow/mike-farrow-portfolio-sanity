import { FieldOptions } from '@studio/schemas/common/fields/field';
import { IconDocumentText } from '@studio/schemas/common/icons';
import { RichTextPreview } from '@studio/schemas/previews/rich-text';

import { defineArrayMember, defineField } from 'sanity';

export function richTextField(options: FieldOptions) {
  const { ...rest } = options;

  return defineField({
    ...rest,
    type: 'object',
    icon: IconDocumentText,
    fields: [
      defineField({
        name: 'content',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'block',
          }),
        ],
      }),
    ],
    preview: {
      select: {
        content: 'content',
      },
      prepare: (selection) => ({ ...selection, title: 'Rich Text' }),
    },
    components: {
      preview: RichTextPreview,
    },
  });
}
