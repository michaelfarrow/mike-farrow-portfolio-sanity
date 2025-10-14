import nextBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

import BREAKPOINTS_MAX from './src/config/breakpoints.json';

export const BREAKPOINT_MAX = Math.max(...Object.values(BREAKPOINTS_MAX)) || 0;

const breakpoints: Record<string, string> = {};

const BREAKPOINTS_MAX_ORDERED = Object.entries(BREAKPOINTS_MAX)
  .map(([name, breakpoint]) => ({
    name: name,
    breakpoint,
  }))
  .sort((a, b) => (a.breakpoint < b.breakpoint ? -1 : 1));

BREAKPOINTS_MAX_ORDERED.forEach((item, i) => {
  const previous = BREAKPOINTS_MAX_ORDERED[i - 1];
  if (previous) {
    breakpoints[item.name] = `${previous.breakpoint}px`;
  }
});

breakpoints['max'] = `${BREAKPOINT_MAX}px`;

const nextConfig: NextConfig = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  distDir: 'dist',
  images: {
    qualities: [25, 50, 75],
    deviceSizes: [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
  sassOptions: {
    additionalData: Object.entries(breakpoints)
      .map(([key, value]) => `$bp-${key}: ${value};`)
      .join('\n'),
  },
});

export default nextConfig;
