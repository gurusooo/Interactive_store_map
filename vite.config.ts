import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
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
