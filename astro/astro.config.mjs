// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { config } from '../common/config';

import sanity from '@sanity/astro';

export default defineConfig({
  integrations: [
    sanity({
      ...config.studio,
      stega: {
        studioUrl: config.url.studio,
      },
    }),
    react(),
  ],
});
