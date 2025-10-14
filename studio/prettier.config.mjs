import baseConfig from '../prettier.config.mjs';

const config = {
  ...baseConfig,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^@?sanity(.*)$',
    '',
    '^@studio/(.*)$',
    '',
    '^[./]',
  ],
};

export default config;
