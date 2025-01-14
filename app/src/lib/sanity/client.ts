import { createClient } from '@sanity/client';
import { config } from '@common/config';

// import {
//   AllSanitySchemaTypes,
//   internalGroqTypeReferenceTo,
// } from '@/types/sanity';

// export type SchemaTypes = AllSanitySchemaTypes['_type'];

// export type SchemaType<T extends SchemaTypes> = UndefinedToNull<
//   ExpandRefs<Extract<AllSanitySchemaTypes, { _type: T }>>
// >;

// export type UnionUndefinedToNull<T> = T extends undefined ? null : T;

// export type UndefinedToNull<T extends object> = {
//   [Prop in keyof T]: T[Prop] extends object
//     ? UndefinedToNull<T[Prop]>
//     : UnionUndefinedToNull<T[Prop]>;
// };

// export type ExpandRefs<T extends object> = {
//   [K in keyof T]: NonNullable<T[K]> extends {
//     _type: 'reference';
//     [internalGroqTypeReferenceTo]?: SchemaTypes;
//   }
//     ? SchemaType<
//         NonNullable<NonNullable<T[K]>[typeof internalGroqTypeReferenceTo]>
//       >
//     : NonNullable<T[K]> extends object
//       ? ExpandRefs<NonNullable<T[K]>>
//       : string;
// };

// type Test2 = PartialOnUndefinedDeep<{
//   one: string;
//   two: undefined | string;
// }>;

// export type Event = SchemaType<'event'>;
// export type Venue = SchemaType<'venue'>;

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

export const client = createClient({
  ...config.studio,
  useCdn: false,
  stega: { studioUrl: config.paths.studio },
});
