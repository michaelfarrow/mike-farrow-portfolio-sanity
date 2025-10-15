const env = process.env.NODE_ENV;
const production = env === 'production';

export const config = {
  env,
  production,
  title: 'Mike Farrow',
  studio: {
    projectId: 'h0q0fht4',
    dataset: process.env.SANITY_STUDIO_DATASET || 'development',
    apiVersion: 'vX',
  },
  url: {
    app: production
      ? 'https://mike-farrow-portfolio-sanity-next.vercel.app'
      : 'http://127.0.0.1:3000',
    studio: production
      ? 'https://mike-farrow-portfolio-sanity-studio.vercel.app'
      : 'http://127.0.0.1:3333',
  },
  google: {
    maps: {
      apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY,
    },
  },
};
