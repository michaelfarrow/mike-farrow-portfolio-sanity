import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { resolve } from '@/presentation/resolve';
import { defaultDocumentNode } from '@/defaultDocumentNode';
import { config } from '@common/config';

export default defineConfig({
  ...config.studio,

  name: 'default',
  title: 'Mike Farrow',

  plugins: [
    structureTool({ defaultDocumentNode }),
    visionTool(),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: `${config.paths.app}/api/draft-mode/enable`,
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
