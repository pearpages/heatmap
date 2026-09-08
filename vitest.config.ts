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
    // createDateString() formats via toISOString() (UTC) while Period boundaries are
    // built with local-time Date constructors. Pin the zone so the suite is
    // deterministic regardless of where it runs.
    env: { TZ: 'UTC' },
  },
});
