import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }
          if (/node_modules\/(react|react-dom|react-router-dom|react-activation|zustand)\//.test(id)) {
            return 'react';
          }
          if (/node_modules\/(antd|@ant-design)\//.test(id)) {
            return 'antd';
          }
          if (/node_modules\/(axios|ahooks)\//.test(id)) {
            return 'commons';
          }
          return 'vendors';
        },
      },
    },
  },
});
