import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        port: 3000,
        open: true,
        host: true,
        watch: {
            usePolling: true, 
            interval: 100 
        }
    },
    css: {
        modules: {
            localsConvention: "camelCase",
            generateScopedName: "[local]_[hash:base64:2]"
        },
        devSourcemap: true
    }
})
