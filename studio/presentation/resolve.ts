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

export type Path = `/${string}`;

export type PathResolver<T> = {
  (doc: T): string;
  path: Path;
};

export function createPathResolver<P extends Path>(path: P) {
  type T = {
    [K in KeysFromPath<P> as K extends `${infer Head extends string}.${string}`
      ? Head
      : K]: K extends `${string}.${infer Tail extends string}`
      ? PathToObject<Tail, PathPartType>
      : PathPartType;
  };

  const create = <TC extends T>(doc: TC) => {
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

  return create satisfies PathResolver<T>;
}

export function createStaticResolver<P extends Path>(path: P, title?: string) {
  const pathF = () => path;
  pathF.title = title;
  return pathF;
}

const cvResolver = createStaticResolver('/cv', 'CV');

export const resolve = {
  project: {
    index: createStaticResolver('/projects'),
    detail: createPathResolver('/projects/[slug.current]'),
  },
  album: {
    index: createStaticResolver('/albums'),
    detail: createPathResolver('/albums/[slug.current]'),
  },
  cv: cvResolver,
  skill: cvResolver,
  experience: cvResolver,
  education: cvResolver,
} satisfies Record<
  string,
  | ReturnType<typeof createStaticResolver>
  | {
      index: ReturnType<typeof createStaticResolver>;
      detail: ReturnType<typeof createPathResolver>;
    }
>;
