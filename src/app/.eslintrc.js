module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
      extraFileExtensions: ['.svelte']
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    env: {
      es6: true,
      browser: true
    },
    plugins: [
      'svelte3',
      '@typescript-eslint'
    ],
    ignorePatterns: [
      'public/build/'
    ],
    overrides: [
      {
        files: ['**/*.svelte'],
        processor: 'svelte3/svelte3'
      }
    ],
    rules: {
      semi: ['error', 'always'],
      quotes: [2, 'single'],
      'no-var': 2,
    },
    settings: {
      'svelte3/typescript': require('typescript'),
    }
  };