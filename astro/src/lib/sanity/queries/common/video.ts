import { imageQuery } from '@astro/lib/sanity/queries/common/image';

export const videoQuery = `
  {
    url,
    poster ${imageQuery},
    alt,
    caption
  }
`;
