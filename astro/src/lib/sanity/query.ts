import type { PartialOnUndefinedDeep } from 'type-fest';
import { type QueryParams } from 'sanity';

import { sanityClient } from 'sanity:client';

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';
const token = import.meta.env.SANITY_API_READ_TOKEN;

// import { sanityFetch } from '@astro/lib/sanity/live';

// export type Query = Parameters<typeof sanityFetch>[0]['query'];
// export type Params = Parameters<typeof sanityFetch>[0]['params'];
export type Query = string;
export type Params = QueryParams;

type NullsToUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[]
          ? NullsToUndefined<U>[]
          : NullsToUndefined<T[K]>;
      };

function nullsToUndefined<T>(
  obj: T
): PartialOnUndefinedDeep<NullsToUndefined<T>, { recurseIntoArrays: true }> {
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
  if (visualEditingEnabled && !token) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.'
    );
  }

  const perspective = visualEditingEnabled ? 'previewDrafts' : 'published';

  const { result, resultSourceMap } = await sanityClient.fetch(query, params, {
    filterResponse: false,
    perspective,
    resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
    stega: visualEditingEnabled,
    ...(visualEditingEnabled ? { token } : {}),
  });

  return {
    data: nullsToUndefined(result),
    sourceMap: resultSourceMap,
    perspective,
  };
}

export function createQuery<T extends Query>(query: T) {
  const rawFetch = () => fetch<T>(query);

  rawFetch.withParams = <P extends Params>(params: P) =>
    fetch<T>(query, params);

  return rawFetch;
}
