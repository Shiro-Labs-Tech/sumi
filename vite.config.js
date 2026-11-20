import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page static build. Pages are generated from tools/build.py.
export default defineConfig({
  server: { proxy: { '/api': 'http://localhost:3000' } }, // npm run serve (API) alongside npm run dev
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
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
