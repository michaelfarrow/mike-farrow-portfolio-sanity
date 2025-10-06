import { fileQuery } from '@app/lib/sanity/queries/common/file';
import { imageQuery } from '@app/lib/sanity/queries/common/image';

export const videoCommonQuery = `
  poster ${imageQuery},
  ratio,
  alt,
  caption
`;

export const videoQuery = `
  {
    file ${fileQuery},
    ${videoCommonQuery}
  }
`;

export const remoteVideoQuery = `
  {
    url,
    ${videoCommonQuery}
  }
`;
