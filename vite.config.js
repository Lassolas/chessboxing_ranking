import { defineConfig } from 'vite'

export default defineConfig({
  // This ensures assets are linked with relative paths (e.g. ./assets/...)
  // which is necessary for GitHub Pages when hosting in a sub-directory like /chessboxing_ranking/
  base: './',
})
