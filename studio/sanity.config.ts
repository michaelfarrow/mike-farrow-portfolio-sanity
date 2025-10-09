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

const settingsSchema = schemas.find((schema) => schema.name === 'settings');
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);
const commonTypes = new Set(['common']);
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
            ...schemas
              .filter(
                (schema) =>
                  !singletonTypes.has(schema.name) &&
                  !commonTypes.has(schema.name)
              )
              .map((schema) => S.documentTypeListItem(schema.name)),
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
