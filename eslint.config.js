import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'tmp/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
    },
  },
];