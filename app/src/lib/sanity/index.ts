/* eslint-disable  @typescript-eslint/no-explicit-any */

import { createClient } from '@sanity/client';
import { defineQuery } from 'groq';
import { map, mapValues } from 'lodash';
import { type PartialOnUndefinedDeep, type ArrayValues } from 'type-fest';

import {
  AllSanitySchemaTypes,
  internalGroqTypeReferenceTo,
} from '@/types/sanity';
import { sanity } from '@/../../package.json';

export type SchemaTypes = AllSanitySchemaTypes['_type'];

export type SchemaType<T extends SchemaTypes> = UndefinedToNull<
  ExpandRefs<Extract<AllSanitySchemaTypes, { _type: T }>>
>;

export type UnionUndefinedToNull<T> = T extends undefined ? null : T;

export type UndefinedToNull<T extends object> = {
  [Prop in keyof T]: T[Prop] extends object
    ? UndefinedToNull<T[Prop]>
    : UnionUndefinedToNull<T[Prop]>;
};

export type UnionNullToUndefined<T> = T extends null ? undefined : T;

export type NullToUndefined<T extends object | object[]> = T extends object[]
  ? NullToUndefined<ArrayValues<T>>[]
  : PartialOnUndefinedDeep<{
      [Prop in keyof T]: null extends T[Prop]
        ?
            | (NonNullable<T[Prop]> extends object | object[]
                ? NullToUndefined<NonNullable<T[Prop]>>
                : NonNullable<T[Prop]>)
            | undefined
        : T[Prop] extends object | object[]
          ? NullToUndefined<T[Prop]>
          : T[Prop];

      // [Prop in keyof T]:
      //   | (NonNullable<T[Prop]> extends object | object[]
      //       ? NullToUndefined<NonNullable<T[Prop]>>
      //       : NonNullable<T[Prop]>)
      //   | (null extends T[Prop] ? undefined : null);

      // [Prop in keyof T]: NonNullable<T[Prop]> extends object | object[]
      //   ? null extends T[Prop]
      //     ? NullToUndefined<NonNullable<T[Prop]>> | undefined
      //     : NullToUndefined<NonNullable<T[Prop]>>
      //   : null extends T[Prop]
      //     ? NonNullable<T[Prop]> | undefined
      //     : NonNullable<T[Prop]>;
    }>;

export type ExpandRefs<T extends object> = {
  [K in keyof T]: NonNullable<T[K]> extends {
    _type: 'reference';
    [internalGroqTypeReferenceTo]?: SchemaTypes;
  }
    ? SchemaType<
        NonNullable<NonNullable<T[K]>[typeof internalGroqTypeReferenceTo]>
      >
    : NonNullable<T[K]> extends object
      ? ExpandRefs<NonNullable<T[K]>>
      : string;
};

// type Test2 = PartialOnUndefinedDeep<{
//   one: string;
//   two: undefined | string;
// }>;

export type Event = SchemaType<'event'>;
export type Venue = SchemaType<'venue'>;

// type Test = NullToUndefined<{
//   test: string | null;
//   venue: { name: string | null } | null;
//   another: number;
// }>;

// const test: Test = {
//   venue: {
//     name: 'test',
//   },
//   // another: 2,
// };

// NonNullable<NonNullable<T[K]>[typeof internalGroqTypeReferenceTo]>
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

const IMAGE = defineQuery(`{
  ...,
  ...asset-> {
    ...,
    ...metadata {
      lqip, // the lqip can be used for blurHashUrl or other low-quality placeholders
      ...dimensions {
        width,
        height
      }
    }
  }
}`);

export const eventFullQuery = defineQuery(`
  *[_type == "event" && _id == $id]{
    ...,
    image ${IMAGE},
    headline-> {
      ...
    },
    venue-> {
      ...
    },
  }[0]
`);

export const eventsQuery = defineQuery(`
  *[_type == "event"]{
    _id,
    name,
    slug,
    venue->{
      name
    },
    image ${IMAGE}
  }
`);

// export const eventQuery = defineQuery(`
//   *[_type == "event" && _id == $id]{
//     _id,
//     name,
//     image ${IMAGE}
//   }[0]
// `);

export const eventQuery = defineQuery(`
  ${eventFullQuery}{
    _id,
    name
  }
`);

export const client = createClient({
  ...sanity,
  useCdn: false, // set to `false` to bypass the edge cache
});

function nullToUndefined<T extends object | object[]>(
  o: T
): NullToUndefined<T> {
  return ((Array.isArray(o) ? map : mapValues) as any)(o, (v: any) => {
    if (v === null) return undefined;
    if (typeof v === 'object') return nullToUndefined(v);
    return v;
  });
}

async function fetch<T extends Parameters<typeof client.fetch>[0]>(
  query: T,
  params?: Parameters<typeof client.fetch>[1]
) {
  const res = await client.fetch(query, params);
  return nullToUndefined(res);
}

export function getEvents() {
  return fetch(eventsQuery);
}

export function getEvent(id: string) {
  return fetch(eventQuery, {
    id,
  });
}

// export async function createPost(post: Post) {
//   const result = client.create(post);
//   return result;
// }

// export async function updateDocumentTitle(_id, title) {
//   const result = client.patch(_id).set({ title });
//   return result;
// }
