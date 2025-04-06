import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // This will help with any TypeScript errors during build
          ['@babel/plugin-transform-typescript', { allowDeclareFields: true }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Skip TypeScript checking
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})