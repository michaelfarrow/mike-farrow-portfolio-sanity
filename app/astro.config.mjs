// @ts-check
import react from '@astrojs/react';
import vercelServerless from '@astrojs/vercel/serverless';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';

import { config } from '../common/config';
import { plugins as postCssPlugins } from './postcss.config.mjs';

const visualEditingEnabled =
  import.meta.env.SANITY_VISUAL_EDITING_ENABLED === 'true';

export default defineConfig({
  output: visualEditingEnabled ? 'server' : 'static',
  adapter: visualEditingEnabled ? vercelServerless({}) : undefined,
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
