const env = process.env.NODE_ENV;
const production = env === 'production';

export const config = ({ dataset }: { dataset?: string }) => ({
  env,
  production,
  title: 'Mike Farrow',
  studio: {
    projectId: 'h0q0fht4',
    dataset: dataset || 'development',
    apiVersion: 'vX',
  },
  url: {
    app: production
      ? 'https://mike-farrow-portfolio-sanity-next.vercel.app'
      : 'http://localhost:3000',
    studio: production
      ? 'https://mike-farrow-portfolio-sanity-studio.vercel.app'
      : 'http://localhost:3333',
  },
  google: {
    maps: {
      apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY,
    },
  },
});
