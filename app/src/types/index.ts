import type { HTMLAttributes, HTMLTag } from 'astro/types';
import type { ComponentPropsWithoutRef } from 'react';

export type NullsToUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[]
          ? NullsToUndefined<U>[]
          : NullsToUndefined<T[K]>;
      };

export type AstroReactElement<T extends HTMLTag> = HTMLAttributes<T> &
  ComponentPropsWithoutRef<T>;
