import { defineCliConfig } from 'sanity/cli';
import { sanity } from '../package.json';

export default defineCliConfig({
  api: sanity,
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
});
