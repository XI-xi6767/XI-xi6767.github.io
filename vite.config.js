import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import vitePluginScanProjects from './vite-plugin-scan-projects.js'

export default defineConfig({
  plugins: [vue(), vitePluginScanProjects()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  }
})
