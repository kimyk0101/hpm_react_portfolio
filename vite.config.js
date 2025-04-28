import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/vworld-api': {
        target: 'http://api.vworld.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vworld-api/, ''),
      },
       '/forest-api': {
        target: 'http://openapi.forest.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/forest-api/, ''),
      },
      '/fire-api': {
        target: 'https://apis.data.go.kr/B552584/ForestFireDanger', // 실제 API URL로 교체
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fire-api/, ''),
      },         
    },    
  },
})



