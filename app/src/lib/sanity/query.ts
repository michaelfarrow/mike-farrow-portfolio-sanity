/* eslint-disable  @typescript-eslint/no-explicit-any */
import { PartialOnUndefinedDeep } from 'type-fest';

import { sanityFetch } from '@app/lib/sanity/live';

export type Query = Parameters<typeof sanityFetch>[0]['query'];
export type Params = Parameters<typeof sanityFetch>[0]['params'];

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
  const res = await sanityFetch({ query, params });
  return nullsToUndefined(res.data);
}

export function createQuery<T extends Query>(query: T) {
  const rawFetch = () => fetch<T>(query);

  rawFetch.withParams = <P extends Params>(params: P) =>
    fetch<T>(query, params);

  return rawFetch;
}
