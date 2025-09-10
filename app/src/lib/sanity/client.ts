import { config } from '@common/config';
import { createClient } from '@sanity/client';

export const client = createClient({
  ...config.studio,
  useCdn: false,
  stega: { studioUrl: config.url.studio },
});
