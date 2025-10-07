import { config as commonConfig } from '../common/config';

export const config = commonConfig({
  dataset: process.env.SANITY_STUDIO_DATASET,
});
