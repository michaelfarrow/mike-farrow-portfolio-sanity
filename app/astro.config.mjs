// @ts-check
import react from '@astrojs/react';
import astro from '@astrojs/vercel';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import { config } from '../common/config';
import { plugins as postCssPlugins } from './postcss.config.mjs';

const { SANITY_VISUAL_EDITING_ENABLED } = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  ''
);

const visualEditingEnabled = SANITY_VISUAL_EDITING_ENABLED === 'true';

export default defineConfig({
  output: visualEditingEnabled ? 'server' : 'static',
  adapter: visualEditingEnabled ? astro() : undefined,
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
