import { defineLive } from 'next-sanity/live';

import { STUDIO_API_READ_TOKEN } from '@astro/lib/env';
import { client } from '@astro/lib/sanity/client';

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: STUDIO_API_READ_TOKEN,
  serverToken: STUDIO_API_READ_TOKEN,
  fetchOptions: {
    revalidate: 60,
  },
});
