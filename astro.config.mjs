import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ayushsaha.dev',
  output: 'static',
  integrations: [tailwind(), react(), sitemap()],
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three') || id.includes('threejs-components')) {
                return 'vendor-three';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              return 'vendor-shared';
            }
          },
        },
      },
    },
  },
});