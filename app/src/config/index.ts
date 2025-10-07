import { config as commonConfig } from '../../../common/config';

export const config = commonConfig({
  dataset: import.meta.env.PUBLIC_SANITY_STUDIO_DATASET,
  googleMapsKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
});
