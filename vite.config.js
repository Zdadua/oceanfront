import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginString from 'vite-plugin-string'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vitePluginString()],
  base: './',
  assetsDir: 'static',

  server: {
    warmup: {
      clientFiles: [
        './src/components/aboutUs/TextCube.vue',
      ],
    },

    proxy: {
      '/data': {
        target: 'http://172.20.163.79:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/data/, ''),
      }
    }
  }

})
