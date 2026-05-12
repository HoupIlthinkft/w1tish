import { defineConfig } from 'vite'
import { nodePolyfills } from "vite-plugin-node-polyfills"
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path';

const isTauriBuild = process.env.TAURI_BUILD === 'true';

// https://vite.dev/config/
export default defineConfig({
  envDir: '../',
  envPrefix: 'API_',
  build: {
    outDir: "../static",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@api': path.resolve(
        __dirname,
        'src/configurationFiles',
        isTauriBuild ? 'tauri_interface.ts' : 'web_interface.ts'
      ),
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
})
