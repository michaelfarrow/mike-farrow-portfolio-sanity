import baseConfig from '../prettier.config.mjs';

const config = {
  ...baseConfig,
  plugins: ['prettier-plugin-astro', ...baseConfig.plugins],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^react$',
    '',
    '^@(common|studio)/(.*)$$',
    '',
    '^@app/layouts/(.*)$',
    '',
    '^@app/(lib|hooks|context)/(.*)$',
    '^@app/components/(.*)$',
    '^@app/(.*)$',
    '',
    '^[./]',
  ],
};

export default config;
