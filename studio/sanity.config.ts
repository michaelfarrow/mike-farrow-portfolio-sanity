import { codeInput } from '@sanity/code-input';
import { googleMapsInput } from '@sanity/google-maps-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { markdownSchema } from 'sanity-plugin-markdown';
import { defineDocuments, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { Logo } from '@studio/components/logo';
import { config } from '@studio/lib/config';
import { resolveDynamic } from '@studio/presentation/resolve-dynamic';
import { resolve } from '@studio/presentation/resolve-studio';
import { schemas, schemasFlat } from '@studio/schemas';

import '@studio/styles/global.css';

const settingsSchema = schemasFlat.find((schema) => schema.name === 'settings');
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);
const singletonTypes = new Set(['settings']);

export default defineConfig({
  ...config.studio,

  name: 'default',
  title: config.title,
  icon: Logo,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...schemas
              .filter((item) => item.type !== 'ignore')
              .map((item) => [
                ...item.schemas.map((schema) =>
                  S.documentTypeListItem(schema.name)
                ),
                S.divider(), //.title(item.title),
              ])
              .flat(),
            ...((settingsSchema && [
              S.listItem()
                .title(settingsSchema.title || '')
                .id(settingsSchema.name)
                .icon(settingsSchema.icon)
                .child(
                  S.document()
                    .schemaType(settingsSchema.name)
                    .documentId(settingsSchema.name)
                ),
            ]) ||
              []),
          ]),
    }),
    visionTool(),
    presentationTool({
      resolve: {
        locations: resolveDynamic(resolve, { link: { deep: true } }),
        mainDocuments: defineDocuments(
          Object.values(resolve).map((item) => item.document)
        ),
      },
      previewUrl: {
        origin: config.url.app,
        previewMode: {
          enable: `${config.url.app}/api/draft-mode/enable`,
        },
      },
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
    types: schemasFlat,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
