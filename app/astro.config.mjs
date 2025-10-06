// @ts-check
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';

import { config } from '../common/config';
import { plugins as postCssPlugins } from './postcss.config.mjs';

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
  vite: {
    css: {
      transformer: 'postcss',
      postcss: { plugins: postCssPlugins },
    },
  },
});
