import postcssSimpleVars from 'postcss-simple-vars';

import BREAKPOINTS_MAX from './src/config/breakpoints.json' with { type: 'json' };

const BREAKPOINT_MAX = Math.max(...Object.values(BREAKPOINTS_MAX)) || 0;

let breakpoints = {};

const BREAKPOINTS_MAX_ORDERED = Object.entries(BREAKPOINTS_MAX)
  .map(([name, breakpoint]) => ({
    name: name,
    breakpoint,
  }))
  .sort((a, b) => (a.breakpoint < b.breakpoint ? 1 : 0));

BREAKPOINTS_MAX_ORDERED.forEach((item, i) => {
  const previous = BREAKPOINTS_MAX_ORDERED[i - 1];
  if (previous) {
    breakpoints[item.name] = `${previous.breakpoint}px`;
  }
});

breakpoints['max'] = `${BREAKPOINT_MAX}px`;

export const plugins = [
  postcssSimpleVars({
    variables: {
      ...breakpoints,
    },
  }),
];
