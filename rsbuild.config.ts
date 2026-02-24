import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
  tools: {
    rspack: {
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              name: 'react',
              priority: 30,
              reuseExistingChunk: true,
            },
            antd: {
              test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
              name: 'antd',
              priority: 20,
              reuseExistingChunk: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      },
    },
  },
});
