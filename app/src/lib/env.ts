if (!process.env.SANITY_STUDIO_API_READ_TOKEN)
  throw new Error('SANITY_STUDIO_API_READ_TOKEN not defined');

export const STUDIO_API_READ_TOKEN = process.env.SANITY_STUDIO_API_READ_TOKEN;
