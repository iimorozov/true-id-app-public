/**
 * Vite Configuration File
 *
 * This file configures the development and build settings for the Vite bundler.
 * It includes settings for plugins, development server, and API proxying.
 */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [react()],

    server: {
      open: true,
      host: true,
      strictPort: false,

      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    },

    define: {
      __API_URL__: JSON.stringify(apiUrl)
    }
  }
})
