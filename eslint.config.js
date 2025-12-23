// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config({
  ignores: [
    'dist',
    'node_modules',
    'analyze-report.cjs',
    'eslint-report-v3.json',
    'eslint-report-v4.json',
  ],
}, js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier: prettierPlugin,
  },
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.jest,
    },
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...prettierConfig.rules,
    'prettier/prettier': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // RULE 1: Component Isolation
    // UI components in src/app cannot import business logic
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/apps/**', 'apps/**'],
            message: 'ARCHITECTURAL VIOLATION (Rule 1): UI components in src/app cannot import from apps/. UI layer must remain isolated from business logic.',
          },
          {
            group: ['**/src/app/Modules/**', '../Modules/**', './Modules/**'],
            message: 'ARCHITECTURAL VIOLATION (Rule 1): Components cannot directly import from Modules. Use proper service layer abstractions.',
          },
        ],
      },
    ],
  },
}, storybook.configs["flat/recommended"], {
  files: ['scripts/**/*.js'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'no-undef': 'off',
  },
});
