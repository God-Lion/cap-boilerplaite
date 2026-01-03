// Enhanced ESLint Config with Architectural Rules
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'analyze-report.cjs',
      'eslint-report-v3.json',
      'eslint-report-v4.json',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
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
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // 🔒 RULE 1: Component Isolation - UI Components Cannot Import from App
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/app/**',
                '../app/**',
                '../../app/**',
                '../../../app/**',
                '@/app/**',
                'app/*',
              ],
              message:
                '❌ ARCHITECTURAL VIOLATION: UI components cannot import from app directory. Use prop drilling or composition instead. UI components must be pure and reusable.',
            },
            {
              group: ['**/services/**', '../services/**', '../../services/**', '@/services/**'],
              message:
                '❌ ARCHITECTURAL VIOLATION: UI components must be stateless. Move business logic to app layer.',
            },
            {
              group: ['**/store/**', '../store/**', '../../store/**', '@/store/**'],
              message:
                '❌ ARCHITECTURAL VIOLATION: UI components cannot access global state directly. Pass data via props.',
            },
          ],
        },
      ],
    },
  },
  // Core components can import from configs and theme
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/app/**', '@/app/**', 'app/*'],
              message:
                '❌ ARCHITECTURAL VIOLATION: Core components cannot import from app. Core is application-agnostic.',
            },
          ],
        },
      ],
    },
  },
  // Storybook files special rules
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off', // Stories can import anything for demonstration
    },
  },
  storybook.configs['flat/recommended'],
)
