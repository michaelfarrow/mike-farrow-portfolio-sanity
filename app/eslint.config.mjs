import { fileURLToPath, URL } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import pluginAstro from 'eslint-plugin-astro';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import tsEslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

const eslintConfig = defineConfig(
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  { ...eslint.configs.recommended, files: ['**/*.ts', '**/*.tsx'] },
  pluginAstro.configs.recommended,
  tsEslint.configs.strict.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  { ...pluginReact.configs.flat.recommended, files: ['**/*.tsx'] },
  pluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);

export default eslintConfig;
