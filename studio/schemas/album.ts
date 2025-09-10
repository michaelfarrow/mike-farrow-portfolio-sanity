import { imageField } from '@studio/schemas/common/fields/image';
import { nameFields } from '@studio/schemas/common/fields/title';
import { IconAlbum } from '@studio/schemas/common/icons';

import { defineField, defineType } from 'sanity';

export const album = defineType({
  name: 'album',
  type: 'document',
  icon: IconAlbum,
  fields: [
    ...nameFields(),
    defineField({
      name: 'date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'geopoint',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [
        imageField({
          name: 'photo',
          caption: true,
          fields: [
            defineField({
              name: 'location',
              type: 'geopoint',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photos.0.asset',
      photos: 'photos',
    },
    prepare: (selection) => {
      const { photos } = selection;
      const photoCount = Object.values(photos || {}).length;
      return {
        ...selection,
        subtitle: `${photoCount} photo${photoCount !== 1 ? 's' : ''}`,
      };
    },
  },
});
