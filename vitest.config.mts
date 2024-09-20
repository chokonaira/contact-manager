import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    globals: true,
    coverage: {
      all: true,
      enabled: true,
      include: ['**/*.ts', '**/*.tsx', '**/*.js'],
      exclude: ['.expo/**', '.github/**', 'app/_layout.tsx', 'app/+html.tsx', 'app/+not-found.tsx'],
      reporter: ['cobertura', 'text', 'html'],
      provider: 'istanbul'
    },
  },
})