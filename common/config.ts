const env = process.env.NODE_ENV;
const production = env === 'production';

export const config = {
  env,
  production,
  studio: {
    projectId: 'h0q0fht4',
    dataset: 'production',
    apiVersion: 'vX',
  },
  paths: {
    app: production
      ? 'https://mike-farrow-portfolio-app.vercel.app'
      : 'http://localhost:3000',
    studio: production
      ? 'https://mike-farrow-portfolio-studio.vercel.app'
      : 'http://localhost:3333',
  },
};
