import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock import.meta.env globally
vi.stubGlobal('import.meta', {
  env: {
    VITE_GA_MEASUREMENT_ID: 'G-TEST123456',
    MODE: 'test',
    BASE_URL: '/',
    DEV: false,
    PROD: false,
    SSR: false
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  debug: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
