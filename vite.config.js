import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page static build. Pages are generated from tools/build.py.
export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        story: resolve(__dirname, 'story.html'),
        reserve: resolve(__dirname, 'reserve.html'),
      },
    },
  },
});
