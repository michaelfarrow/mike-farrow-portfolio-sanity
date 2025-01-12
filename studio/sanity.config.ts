import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

import { sanity } from '../package.json';

export default defineConfig({
  ...sanity,

  name: 'default',
  title: 'Mike Farrow',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
