import { config as commonConfig } from '../common/config';

export const config = commonConfig({
  dataset: process.env.PUBLIC_SANITY_STUDIO_DATASET,
});
