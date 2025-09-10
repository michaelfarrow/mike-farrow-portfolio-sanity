import { FieldOptions } from '@studio/schemas/common/fields/field';
import {
  imageField,
  responsiveImageField,
} from '@studio/schemas/common/fields/image';
import { markdownObjectField } from '@studio/schemas/common/fields/markdown-object';
import { videoField } from '@studio/schemas/common/fields/video';
import {
  conditionalField,
  conditionalFields,
} from '@studio/schemas/common/utils';
import { ContentRowPreview } from '@studio/schemas/previews/content-row';

import { defineArrayMember, defineField } from 'sanity';

// import {
//   externalLinkAnnotation,
//   internalLinkAnnotation,
// } from '@studio/schemas/common/blocks/annotations/link';

interface ContentArrayOptions extends FieldOptions {
  text?: boolean;
  images?: boolean;
  videos?: boolean;
  columns?: boolean;
}

export function contentArrayField({
  text,
  images,
  videos,
  columns,
  ...rest
}: ContentArrayOptions): any {
  return defineField({
    ...rest,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'item',
        fields: [
          defineField({
            name: 'name',
            type: 'string',
          }),
          defineField({
            name: 'span',
            type: 'string',
            initialValue: 'full',
            validation: (rule) => rule.required(),
            options: {
              layout: 'radio',
              list: [
                { value: 'half', title: 'Half width' },
                { value: 'full', title: 'Full width' },
              ],
              direction: 'horizontal',
            },
          }),
          defineField({
            name: 'content',
            type: 'array',
            of: [
              ...conditionalFields(
                conditionalField(text, () =>
                  markdownObjectField({ name: 'md', title: 'Markdown' })
                ),
                conditionalField(images, () => [
                  imageField({ name: 'image', required: true, caption: true }),
                  responsiveImageField({
                    name: 'responsiveImage',
                    required: true,
                    caption: true,
                  }),
                ]),
                conditionalField(videos, () =>
                  videoField({ name: 'video', caption: true })
                )
              ),
            ],
          }),
        ],
        preview: {
          select: {
            title: 'name',
            span: 'span',
            content: 'content',
          },
        },
        components: {
          preview: ContentRowPreview,
        },
      }),
    ],
  });
}
