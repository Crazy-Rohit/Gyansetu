import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // three is large; pre-bundling it at dev-server startup keeps the badge
    // modal from stalling for several seconds the first time it opens.
    include: ['three'],
  },
})
