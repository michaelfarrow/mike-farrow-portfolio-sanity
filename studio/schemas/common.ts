import { defineType } from 'sanity';

import { codeField } from '@studio/schemas/common/fields/code';
import {
  imageField,
  responsiveImageField,
} from '@studio/schemas/common/fields/image';
import { quoteField } from '@studio/schemas/common/fields/quote';
import {
  remoteVideoField,
  videoField,
} from '@studio/schemas/common/fields/video';

export const common = defineType({
  name: 'common',
  type: 'object',
  fields: [
    imageField({ name: 'image', caption: true }),
    imageField({ name: 'decorativeImage', decorative: true }),
    responsiveImageField({ name: 'responsiveImage', caption: true }),
    videoField({ name: 'video', caption: true }),
    remoteVideoField({ name: 'remoteVideo', caption: true }),
    quoteField({ name: 'quote' }),
    codeField({ name: 'code' }),
  ],
});
