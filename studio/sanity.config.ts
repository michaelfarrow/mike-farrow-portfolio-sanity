import { codeInput } from '@sanity/code-input';
import { googleMapsInput } from '@sanity/google-maps-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { markdownSchema } from 'sanity-plugin-markdown';
import { defineDocuments, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { Logo } from '@studio/components/logo';
import { config } from '@studio/config';
import { resolveDynamic } from '@studio/presentation/resolve-dynamic';
import { resolve } from '@studio/presentation/resolve-studio';
import { schemas } from '@studio/schemas';

import '@studio/styles/global.css';

export default defineConfig({
  ...config.studio,

  name: 'default',
  title: config.title,
  icon: Logo,

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      resolve: {
        locations: resolveDynamic(resolve, { link: { deep: true } }),
        mainDocuments: defineDocuments(
          Object.values(resolve).map((item) => item.document)
        ),
      },
      previewUrl: config.url.app,
      // previewUrl: {
      //   origin: config.url.app,
      //   previewMode: {
      //     enable: `${config.url.app}/api/draft-mode/enable`,
      //   },
      // },
      allowOrigins: ['http://localhost:*'],
    }),
    googleMapsInput({
      apiKey: config.google.maps.apiKey || '',
      defaultLocale: 'en-GB',
      defaultLocation: {
        lat: 54.5,
        lng: -4.5,
      },
      defaultZoom: 6,
    }),
    codeInput(),
    markdownSchema(),
  ],

  schema: {
    types: schemas,
  },
});
