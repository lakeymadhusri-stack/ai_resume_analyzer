import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, requests to /ollama-api/* are forwarded to ollama.com so the
// browser never hits a CORS wall. On Netlify / Vercel the same path is handled
// by the rewrite rules in netlify.toml and vercel.json (no server code needed).
export default defineConfig({
  plugins: [react()],
  build: { target: 'es2020' },
  optimizeDeps: { esbuildOptions: { target: 'es2020' } },
  server: {
    proxy: {
      '/ollama-api': {
        target: 'https://ollama.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ollama-api/, ''),
      },
    },
  },
});
