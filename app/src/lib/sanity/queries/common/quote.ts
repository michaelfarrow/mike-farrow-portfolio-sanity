import { linkQuery } from '@app/lib/sanity/queries/common/link';

export const quoteQuery = `
  {
    quote,
    attribution,
    link-> ${linkQuery}
  }
`;
