import breakpoints from '@common/config/breakpoints';

export const BREAKPOINTS_MIN = breakpoints;

export type BREAKPOINT_NAME = Exclude<keyof typeof BREAKPOINTS_MIN, '2xl'>;

export function breakpointSize(size: string | number) {
  return typeof size === 'number' ? `${size}px` : size;
}

export function breakpointSizes(
  ...sizes: (
    | number
    | string
    | { min: BREAKPOINT_NAME | number; size: number | string }
  )[]
) {
  if (!sizes.length) return '100vw';
  return sizes
    .map((item) => {
      if (typeof item === 'object' && 'size' in item) {
        const minWidth =
          (typeof item.min === 'string' &&
            BREAKPOINTS_MIN[item.min] &&
            breakpointSize(BREAKPOINTS_MIN[item.min].width)) ||
          breakpointSize(item.min);
        return `(min-width: ${minWidth}) ${breakpointSize(item.size)}`;
      } else {
        return `${breakpointSize(item)}`;
      }
    })
    .join(', ');
}
