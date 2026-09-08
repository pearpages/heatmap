import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// `vite --mode source` resolves @pearpages/heatmap to ../src: HMR, no build step.
// Any other mode resolves it through the package's own exports map into ../dist —
// exactly what an npm consumer gets. The deployed build always uses dist.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    // Order matters: Vite string aliases are prefix matches, first hit wins.
    alias:
      mode === 'source'
        ? [
            {
              find: '@pearpages/heatmap/example.css',
              replacement: path.resolve(__dirname, 'src/styles.noop.css'),
            },
            {
              find: '@pearpages/heatmap/styles.css',
              replacement: path.resolve(__dirname, 'src/styles.noop.css'),
            },
            {
              find: '@pearpages/heatmap/example',
              replacement: path.resolve(__dirname, '../src/entries/example.ts'),
            },
            {
              find: '@pearpages/heatmap',
              replacement: path.resolve(__dirname, '../src/index.ts'),
            },
            // src/entries/example.ts re-exports from '@/Example', so the library's
            // own path alias has to resolve too.
            { find: '@', replacement: path.resolve(__dirname, '../src') },
          ]
        : [],
  },
  optimizeDeps: { exclude: ['@pearpages/heatmap'] },
}))
