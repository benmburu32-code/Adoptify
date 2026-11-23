import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Co-locating a Context provider and its `useX` hook in one file is a
      // standard, taught pattern. This rule only protects Fast-Refresh (a
      // dev-only HMR convenience), so we turn it off rather than splitting
      // the context across files purely to please the linter.
      'react-refresh/only-export-components': 'off',
    },
  },
])
