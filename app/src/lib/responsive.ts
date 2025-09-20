import { sortBy } from 'lodash';

export const BREAKPOINT_MAX = 1500;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
  desktop: null,
};

type BREAKPOINT_NAME = keyof typeof BREAKPOINTS | 'desktop';

const BREAKPOINTS_ORDERED = sortBy(
  Object.entries(BREAKPOINTS).map(([name, breakpoint]) => ({
    name: name as BREAKPOINT_NAME,
    breakpoint,
  })),
  ({ breakpoint }) => breakpoint
);

export function breakpointSizes(
  options: {
    max?: boolean;
    breakpoints?: { [k in BREAKPOINT_NAME]?: string };
  } = {}
) {
  const sizes: string[] = [];
  const breakpoints = { desktop: '100vw', ...options.breakpoints };

  BREAKPOINTS_ORDERED.forEach((item) => {
    const found = breakpoints[item.name];
    if (!found) return;
    if (item.breakpoint) {
      sizes.push(`(max-width: ${item.breakpoint - 1}px) ${found}`);
      return;
    }
    if (options.max) {
      sizes.push(`(max-width: ${BREAKPOINT_MAX - 1}px) ${found}`);
      sizes.push(`${BREAKPOINT_MAX}px`);
      return;
    }
    sizes.push(found);
  });

  return sizes.join(', ');
}

// console.log(
//   breakpointSizes({
//     breakpoints: { mobile: '100vw', desktop: '50vw' },
//     max: true,
//   })
// );
// console.log('');
