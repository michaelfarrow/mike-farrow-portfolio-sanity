import { fileQuery } from '@app/lib/sanity/queries/common/file';
import { imageQuery } from '@app/lib/sanity/queries/common/image';

export const videoQuery = `
  {
    file ${fileQuery},
    poster ${imageQuery},
    alt,
    caption
  }
`;

export const remoteVideoQuery = `
  {
    url,
    poster ${imageQuery},
    alt,
    caption
  }
`;
