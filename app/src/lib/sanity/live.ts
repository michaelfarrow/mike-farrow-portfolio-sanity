import { client } from '@/lib/sanity/client';
import { token } from '@/lib/sanity/token';
import { defineLive } from 'next-sanity';

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
});
