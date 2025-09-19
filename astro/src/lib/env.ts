if (!import.meta.env.SECRET_SANITY_STUDIO_API_READ_TOKEN)
  throw new Error('SECRET_SANITY_STUDIO_API_READ_TOKEN not defined');

export const STUDIO_API_READ_TOKEN = import.meta.env
  .SECRET_SANITY_STUDIO_API_READ_TOKEN;
