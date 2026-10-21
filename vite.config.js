import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'three-bundle';
          }
          if (id.includes('node_modules/recharts')) {
            return 'charts-bundle';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion-bundle';
          }
        },
      },
    },
  },
});
