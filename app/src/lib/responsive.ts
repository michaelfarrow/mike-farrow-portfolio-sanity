import breakpoints from '@app/config/breakpoints.json';

export const BREAKPOINTS_MAX = breakpoints;

export const BREAKPOINT_MAX = Math.max(...Object.values(BREAKPOINTS_MAX)) || 0;

export type BREAKPOINT_NAME = keyof typeof BREAKPOINTS_MAX;

export function breakpointSize(size: string | number) {
  return typeof size === 'number' ? `${size}px` : size;
}

export function breakpointSizes(
  ...sizes: (
    | number
    | string
    | { max: BREAKPOINT_NAME; size: number | string }
  )[]
) {
  if (!sizes.length) return '100vw';
  return sizes
    .map((item) => {
      if (typeof item === 'object' && 'size' in item) {
        return `(max-width: ${breakpointSize(BREAKPOINTS_MAX[item.max] - 1)}) ${breakpointSize(item.size)}`;
      } else {
        return `${breakpointSize(item)}`;
      }
    })
    .join(', ');
}
