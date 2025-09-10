import { flatten } from 'flat';

export type PathPartType = string | number;

export type KeysFromPath<T extends string> =
  T extends `${string}[${infer X}]${infer tail}`
    ? X | KeysFromPath<tail>
    : never;

export type PathToObject<
  T extends string,
  V,
> = T extends `${infer Head extends string}.${infer Tail extends string}`
  ? { [K in Head]: PathToObject<Tail, V> }
  : { [K in T]: V };

function createPathResolver<P extends `/${string}`>(path: P) {
  const create = <
    T extends P extends any
      ? any
      : {
          [K in KeysFromPath<P> as K extends `${infer Head extends string}.${string}`
            ? Head
            : K]: K extends `${string}.${infer Tail extends string}`
            ? PathToObject<Tail, PathPartType>
            : PathPartType;
        },
  >(
    doc: T
  ) => {
    let p: string = path;
    const flat = flatten<T, Record<string, PathPartType | undefined | null>>(
      doc
    );
    for (const [key, val] of Object.entries(flat)) {
      if (val !== null && val !== undefined)
        p = p.replaceAll(`[${key}]`, String(val));
    }
    return p;
  };

  create.path = path;

  return create;
}

export type PathWithSlug = {
  slug: { current: string };
};

export type PathResolver = ReturnType<typeof createPathResolver>;

export const resolve = {
  project: createPathResolver('/projects/[slug.current]')<PathWithSlug>,
  album: createPathResolver('/albums/[slug.current]')<PathWithSlug>,
};
