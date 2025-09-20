import { ObjectDefinition, defineArrayMember, defineField } from 'sanity';

import type { CustomFieldOptions } from '@studio/schemas/common/fields/field';
import { IconDocumentText } from '@studio/schemas/common/icons';
import { RichTextPreview } from '@studio/schemas/previews/rich-text';

export function richTextField({
  ...rest
}: CustomFieldOptions<ObjectDefinition, 'fields' | 'preview' | 'components'>) {
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
