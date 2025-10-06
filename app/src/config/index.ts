import { config as commonConfig } from '../../../common/config';

export const config = commonConfig({
  dataset: import.meta.env.PUBLIC_SANITY_STUDIO_DATASET,
});
