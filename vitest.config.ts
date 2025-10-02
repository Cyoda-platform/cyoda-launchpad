import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['tests/e2e/**/*'], // Exclude E2E tests from Vitest
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify('G-TEST123456'),
    'import.meta.env.MODE': JSON.stringify('test'),
    'import.meta.env.BASE_URL': JSON.stringify('/'),
    'import.meta.env.DEV': false,
    'import.meta.env.PROD': false,
    'import.meta.env.SSR': false,
  },
  esbuild: {
    jsx: 'automatic',
  },
});
