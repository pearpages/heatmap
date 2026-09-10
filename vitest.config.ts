import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    // Determinism only: the library no longer depends on the zone, and
    // src/shared/timezones.test.ts overrides TZ per test to prove it. Pin the default
    // so fixtures built with `new Date('2024-01-01')` mean the same day everywhere.
    env: { TZ: 'UTC' },
  },
});
