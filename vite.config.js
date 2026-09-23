import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Only the production build is served from
  // https://<user>.github.io/Gyansetu/ on GitHub Pages, so only it needs
  // this prefix. `npm run dev` keeps serving at plain "/", same as always.
  base: command === 'build' ? '/Gyansetu/' : '/',
  optimizeDeps: {
    // three is large; pre-bundling it at dev-server startup keeps the badge
    // modal from stalling for several seconds the first time it opens.
    include: ['three'],
  },
}))
