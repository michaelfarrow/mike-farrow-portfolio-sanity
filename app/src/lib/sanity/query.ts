/* eslint-disable  @typescript-eslint/no-explicit-any */
import { draftMode } from 'next/headers';

import { sanityClient } from '@app/lib/sanity/client';

export type Query = Parameters<typeof sanityClient.fetch>[0];
export type Params = Parameters<typeof sanityClient.fetch>[1];

type NullsToUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[]
          ? NullsToUndefined<U>[]
          : NullsToUndefined<T[K]>;
      };

function nullsToUndefined<T>(obj: T): NullsToUndefined<T> {
  if (obj === null) {
    return undefined as any;
  }

  if (obj?.constructor.name === 'Object') {
    for (const key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(nullsToUndefined) as any;
  }

  return obj as any;
}

export async function fetch<T extends Query>(query: T, params?: Params) {
  let draftModeEnabled = false;

  try {
    draftModeEnabled = (await draftMode()).isEnabled;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {}

  const res = await sanityClient.fetch(query, params, {
    perspective: draftModeEnabled ? 'drafts' : 'published',
    useCdn: !draftModeEnabled,
    stega: draftModeEnabled,
    token: process.env.SANITY_STUDIO_API_READ_TOKEN,
  });

  return nullsToUndefined(res);
}

export function createQuery<T extends Query>(query: T) {
  const rawFetch = () => fetch<T>(query);

  rawFetch.withParams = <P extends Params>(params: P) =>
    fetch<T>(query, params);

  return rawFetch;
}
