import { config as commonConfig } from '../common/config';

export const config = commonConfig({
  dataset: process.env.SANITY_STUDIO_DATASET,
  googleMapsKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY,
});
