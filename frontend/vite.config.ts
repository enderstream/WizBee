import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
// import path from 'path'

export default defineConfig((env) => {
  const isDevMode = env.mode === 'development'

  return {
    plugins: [react()],
    css: {
      devSourcemap: isDevMode,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@': path.resolve(__dirname, './src'),
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
      // 개발모드일 때와 프로덕션 모드일 때 다른 설정 적용
      minify: !isDevMode,
      sourcemap: isDevMode,
      // manualChunks 설정 제거
      outDir: 'dist',
    },
  }
})