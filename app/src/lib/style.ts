import React from 'react';

import { Falsey } from '@app/lib/types';

export type CSSPropertiesWithVars = React.CSSProperties & {
  [key: `--${string}`]: unknown;
};

export function styleWithVars(
  styles: React.CSSProperties | undefined,
  vars: Falsey | CSSPropertiesWithVars | undefined
) {
  return { ...styles, ...vars } as React.CSSProperties;
}
