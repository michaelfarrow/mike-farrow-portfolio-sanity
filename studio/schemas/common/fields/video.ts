import getYouTubeID from 'get-youtube-id';

import { ObjectDefinition, defineField } from 'sanity';

import type { CustomFieldOptions } from '@studio/schemas/common/fields/field';
import { imageField } from '@studio/schemas/common/fields/image';
import { IconVideo } from '@studio/schemas/common/icons';
import { DocumentPreview } from '@studio/schemas/previews/document';

export function videoField({
  caption,
  ...rest
}: CustomFieldOptions<
  ObjectDefinition,
  'fields' | 'preview' | 'components',
  {
    caption?: boolean;
  }
>) {
  return defineField({
    ...rest,
    type: 'object',
    icon: IconVideo,
    fields: [
      defineField({
        name: 'url',
        type: 'url',
        validation: (rule) =>
          rule
            .required()
            .custom(
              (value) =>
                (getYouTubeID(value || '') && true) || 'Invalid YouTube url'
            ),
      }),
      imageField({
        name: 'poster',
        decorative: true,
      }),
      defineField({
        name: 'alt',
        title: 'Alternative Text',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      ...(caption
        ? [
            defineField({
              name: 'caption',
              type: 'text',
              rows: 4,
            }),
          ]
        : []),
    ],
    preview: {
      select: {
        media: 'poster',
        title: 'alt',
        subtitle: 'caption',
      },
    },
    components: {
      preview: DocumentPreview,
    },
  });
}
