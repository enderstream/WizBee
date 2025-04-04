import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig((env) => {
  const isDevMode = env.mode === 'development'

  return {
    plugins: [react(), tailwindcss()],
    css: {
      devSourcemap: isDevMode,
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
      minify: !isDevMode,
      sourcemap: isDevMode,
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'], // React 관련 라이브러리
            router: ['react-router-dom'], // 라우팅 관련
            state: ['zustand'], // 상태 관리 관련
            http: ['axios'] // HTTP 요청 관련
          },
        },
      },
    },
  }
})