import { createClient } from '@sanity/client';
import { defineQuery } from 'groq';

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
  [Prop in keyof T]-?: T[Prop] extends object
    ? UndefinedToNull<T[Prop]>
    : UnionUndefinedToNull<T[Prop]>;
};

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

export type Event = SchemaType<'event'>;

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
  *[_type == "event"]{name, image ${IMAGE}}
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

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getEvents() {
  const events = await client.fetch(eventsQuery);
  return events;
}

export async function getEvent(id: string) {
  const event = await client.fetch(eventQuery, {
    id,
  });
  return event;
}

// export async function createPost(post: Post) {
//   const result = client.create(post);
//   return result;
// }

// export async function updateDocumentTitle(_id, title) {
//   const result = client.patch(_id).set({ title });
//   return result;
// }
