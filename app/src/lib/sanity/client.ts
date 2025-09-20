import { createClient } from '@sanity/client';

import { config } from '@common/config';

export const client = createClient({
  ...config.studio,
  useCdn: false,
  stega: { studioUrl: config.url.studio },
});
