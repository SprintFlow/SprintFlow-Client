import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    testTimeout: 10000, // Aumenta timeout global
    hookTimeout: 10000,
    maxConcurrency: 1, // Reduce concurrencia para evitar "too many open files"
  },
});