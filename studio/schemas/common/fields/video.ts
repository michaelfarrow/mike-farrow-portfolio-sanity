import { ObjectDefinition, defineField } from 'sanity';

import type { CustomFieldOptions } from '@studio/schemas/common/fields/field';
import { imageField } from '@studio/schemas/common/fields/image';
import { IconVideo } from '@studio/schemas/common/icons';
import { DocumentPreview } from '@studio/schemas/previews/document';

export type VideoFieldDefinition = CustomFieldOptions<
  ObjectDefinition,
  'fields' | 'preview' | 'components',
  {
    caption?: boolean;
    field?: ReturnType<typeof defineField>;
  }
>;

const SUPPORTED = {
  youTube:
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|live\/|v\/)?)([\w-]+)(\S+)?$/,
  vimeo:
    /^(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)$/,
};

export function videoField({ caption, field, ...rest }: VideoFieldDefinition) {
  return defineField({
    ...rest,
    type: 'object',
    icon: IconVideo,
    fields: [
      field ||
        defineField({
          name: 'file',
          type: 'file',
          options: {
            accept: 'video/mp4',
          },
          validation: (rule) => rule.required().assetRequired(),
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

export function remoteVideoField({
  ...rest
}: CustomFieldOptions<VideoFieldDefinition, 'field'>) {
  return videoField({
    ...rest,
    field: defineField({
      name: 'url',
      type: 'url',
      validation: (rule) =>
        rule.required().custom((value) => {
          let valid = false;
          for (const regex of Object.values(SUPPORTED)) {
            if (regex.test(value || '')) {
              valid = true;
              break;
            }
          }
          return (
            valid ||
            `Invalid video url, must be one of: ${Object.keys(SUPPORTED).join(', ')}`
          );
        }),
    }),
  });
}
