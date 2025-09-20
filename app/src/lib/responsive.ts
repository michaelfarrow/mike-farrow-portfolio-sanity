import { sortBy } from 'lodash';

export const BREAKPOINT_MAX = 1500;

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1200,
};

type BREAKPOINT_NAME = keyof typeof BREAKPOINTS | 'desktop';

const BREAKPOINTS_ORDERED = sortBy(
  Object.entries(BREAKPOINTS).map(([name, breakpoint]) => ({
    name: name as BREAKPOINT_NAME,
    breakpoint,
  })),
  ({ breakpoint }) => breakpoint || 0
).reverse();

export function breakpointSizes(
  options: {
    default?: string;
    max?: boolean;
    breakpoints?: { [k in BREAKPOINT_NAME]?: string };
  } = {}
) {
  const sizes: string[] = [];
  const breakpoints = { ...options.breakpoints };

  if (options.max)
    sizes.push(`(min-width: ${BREAKPOINT_MAX}px) ${BREAKPOINT_MAX}px`);

  BREAKPOINTS_ORDERED.forEach((item) => {
    const found = breakpoints[item.name];
    if (!found) return;
    if (item.breakpoint) {
      return sizes.push(`(min-width: ${item.breakpoint}px) ${found}`);
    }
    sizes.push(found);
  });

  sizes.push(options.default || '100vw');

  return sizes.join(', ');
}
