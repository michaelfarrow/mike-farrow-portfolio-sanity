import baseConfig from '../prettier.config.mjs';

const config = {
  ...baseConfig,
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
