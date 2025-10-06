import { type QueryParams } from 'sanity';

import { sanityClient } from '@app/lib/sanity/client';
import type { NullsToUndefined } from '@app/types';

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';
const token = import.meta.env.SANITY_STUDIO_API_READ_TOKEN;

export type Query = string;
export type Params = QueryParams;

function nullsToUndefined<T>(obj: T): NullsToUndefined<T> {
  if (obj === null) {
    return undefined as never;
  }

  if (obj?.constructor.name === 'Object') {
    for (const key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as never;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(nullsToUndefined) as never;
  }

  return obj as never;
}

export async function fetch<T extends Query>(query: T, params?: Params) {
  if (visualEditingEnabled && !token) {
    throw new Error(
      'The `SANITY_STUDIO_API_READ_TOKEN` environment variable is required during Visual Editing.'
    );
  }

  const perspective = visualEditingEnabled ? 'drafts' : 'published';

  const { result, resultSourceMap } = await sanityClient.fetch(query, params, {
    filterResponse: false,
    perspective,
    useCdn: perspective === 'published',
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
