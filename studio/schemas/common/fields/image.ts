import { titleCase } from 'title-case';

import {
  ImageDefinition,
  ObjectDefinition,
  defineArrayMember,
  defineField,
} from 'sanity';

import type { CustomFieldOptions } from '@studio/schemas/common/fields/field';
import { IconImage, IconImages } from '@studio/schemas/common/icons';
import { DocumentPreview } from '@studio/schemas/previews/document';

export function imageField({
  decorative,
  required,
  caption,
  fields,
  ...rest
}: CustomFieldOptions<
  ImageDefinition,
  'fieldsets' | 'options' | 'validation',
  {
    decorative?: boolean;
    required?: boolean;
    caption?: boolean;
  }
>) {
  return defineField({
    ...rest,
    type: 'image',
    fieldsets: [
      { name: 'additional', options: { collapsible: true, collapsed: true } },
    ],
    icon: IconImage,
    options: {
      hotspot: true,
      metadata: ['blurhash', 'lqip', 'palette', 'image', 'exif', 'location'],
    },
    validation: required ? (rule) => rule.required() : undefined,
    fields:
      (!decorative && [
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
                fieldset: 'additional',
              }),
            ]
          : []),
        ...(fields || []).map((field) => ({
          ...field,
          fieldset: 'additional',
        })),
      ]) ||
      [],
    preview: {
      select: {
        media: 'asset',
        title: 'alt',
        subtitle: 'caption',
      },
      prepare: (selection) => ({
        ...selection,
        media: selection.media && { asset: selection.media },
      }),
    },
    components: {
      preview: DocumentPreview,
    },
  });
}

interface ResponsiveImageFieldOptions
  extends Omit<ObjectDefinition, 'type' | 'fields' | 'preview' | 'components'> {
  caption?: boolean;
  required?: boolean;
}

export function responsiveImageField({
  required,
  caption,
  ...rest
}: ResponsiveImageFieldOptions) {
  return defineField({
    ...rest,
    type: 'object',
    icon: IconImages,
    fields: [
      imageField({
        name: 'main',
        title: 'Main Image',
        description:
          'Used across all breakpoints, or highest breakpoints if any alternative images are set',
        required,
        caption,
      }),
      defineField({
        name: 'alternative',
        title: 'Alternative Images',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              imageField({
                name: 'image',
                decorative: true,
              }),
              defineField({
                name: 'breakpoint',
                type: 'string',
                options: {
                  list: ['mobile', 'tablet'],
                },
                validation: (rule) => rule.required(),
              }),
            ],
            preview: {
              select: {
                breakpoint: 'breakpoint',
                media: 'image',
              },
              prepare: ({ media, breakpoint }) => ({
                media,
                title:
                  (breakpoint && titleCase(breakpoint)) ||
                  '[No breakpoint selected]',
              }),
            },
          }),
        ],
      }),
    ],
    preview: {
      select: {
        media: 'main.asset',
        title: 'main.alt',
        subtitle: 'main.caption',
      },
    },
    components: {
      preview: DocumentPreview,
    },
  });
}
