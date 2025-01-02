import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  server: {
    proxy: {
      '/api/': {
        target: 'http://120.46.159.231:8088/2022212890', // 你的后端服务器地址
        // target: 'http://120.46.159.231:8088/2022212808', // 你的后端服务器地址
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const token = proxyRes.headers['token']
            if (token) {
              res.setHeader('token', token)
              console.log('token', token)
            }
          })
        },
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
