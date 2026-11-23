// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'src/main.jsx',
        'src/test/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      thresholds: {
        lines: 65,
        functions: 65,
        branches: 65,
        statements: 65,
      },
    },
  },
})