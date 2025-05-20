import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ✅ เปลี่ยนเป็นพอร์ต backend ที่คุณใช้จริง
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // ไม่เปลี่ยน path
      }
    }
  }
})
