import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig((env) => {
  const isDevMode = env.mode.includes('development')

  return {
    plugins: [react()],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      watch: {
        usePolling: true
      },
      host: true,
      strictPort: true,
      port: 15173,
      cors: true,
      allowedHosts: ['j12b102.p.ssafy.io', 'localhost']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: [
              'react',
              'react-dom',
              'react-router',
              'react-calendar',
              'react-icons',
              'react-error-boundary',
            ],
            ecosystem: ['swiper', 'zustand', 'dayjs'],
            mui: ['@mui/material', '@mui/x-date-pickers'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
  }
})