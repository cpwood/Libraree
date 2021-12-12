module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json']
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
      '@typescript-eslint'
    ],
    ignorePatterns: [
      'dist/'
    ],
    overrides: [],
    rules: {
      semi: ['error', 'always'],
      quotes: [2, 'single'],
      'no-var': 2,
    },
    settings: {
    }
  };