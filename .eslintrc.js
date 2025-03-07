module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'curly': ['error', 'all'],
    'quote-props': ['error', 'consistent-as-needed'],
    'space-before-function-paren': ['error', 'always'],
    'no-var': 'error',

    'eqeqeq': 'warn',
    'no-mixed-operators': 'warn',
    'prefer-promise-reject-errors': 'warn',

    // Disable rules that would cause too many errors initially
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',

    'prefer-regex-literals': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
