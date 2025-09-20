import { defineType } from 'sanity';

import {
  imageField,
  responsiveImageField,
} from '@studio/schemas/common/fields/image';
import { quoteField } from '@studio/schemas/common/fields/quote';
import { videoField } from '@studio/schemas/common/fields/video';

export const common = defineType({
  name: 'common',
  type: 'object',
  fields: [
    imageField({ name: 'image', caption: true }),
    imageField({ name: 'decorativeImage', decorative: true }),
    responsiveImageField({ name: 'responsiveImage', caption: true }),
    videoField({ name: 'video', caption: true }),
    quoteField({ name: 'quote' }),
  ],
});
