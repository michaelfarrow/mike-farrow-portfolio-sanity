import baseConfig from '../prettier.config.mjs';

/** @type {import('prettier').Config} */
const config = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, 'prettier-plugin-tailwindcss'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^react$',
    '^next(/.*)?$',
    '',
    '^@(common|studio)/(.*)$$',
    '',
    '^@app/types/(.*)$',
    '^@app/(lib|hooks|context)/(.*)$',
    '^@app/components/(.*)$',
    '^@app/(.*)$',
    '',
    '^[./]',
  ],
};

export default config;
