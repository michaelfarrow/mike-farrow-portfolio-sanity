import { defineCliConfig } from 'sanity/cli';
import { config } from '@common/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineCliConfig({
  api: config.studio,
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: false,

  vite: {
    plugins: [tsconfigPaths()],
  },
});
