import { config } from '@common/config';
import tsconfigPaths from 'vite-tsconfig-paths';

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: config.studio,

  autoUpdates: false,

  vite: {
    plugins: [tsconfigPaths()],
  },
});
