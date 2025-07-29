// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://api.claude.ai',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    base: '/chatIa/', //Debe coincidir con el nombre del repositorio
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
});
