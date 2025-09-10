import { Falsey } from 'lodash';

export type CSSPropertiesWithVars = React.CSSProperties & {
  [key: `--${string}`]: unknown;
};

export function styleWithVars(
  styles: React.CSSProperties | undefined,
  vars: Falsey | CSSPropertiesWithVars | undefined
) {
  return { ...styles, ...vars } as React.CSSProperties;
}
