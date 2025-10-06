import { createClient } from '@sanity/client';

import { config } from '@app/config';

export const sanityClient = createClient({
  ...config.studio,
  stega: {
    studioUrl: config.url.studio,
  },
});
