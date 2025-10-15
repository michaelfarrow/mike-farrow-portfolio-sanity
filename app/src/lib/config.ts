import { config as commonConfig } from '@common/config';

export const config = commonConfig({
  dataset: process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET,
});
