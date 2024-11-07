import { defineConfig, type Rollup, type InlineConfig, Plugin } from 'vite'
// ...
import solidPlugin from 'vite-plugin-solid'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import { stylex as stylexPlugin } from 'vite-plugin-stylex-dev'
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer'
// ...
import { getEsbuildConfig, getAliasPath, internals, outPutFilenameConfig } from './scripts/vite'
import packageJson from './package.json'

const dependencies = Object.values(packageJson.dependencies)

const rollupOutputOptions: Rollup.OutputOptions = {
  ...outPutFilenameConfig,
  manualChunks: {
    editor: ["@tiptap/core"],
    editorExtension: [
      "@tiptap/starter-kit",
      ...dependencies.filter(it => it.includes('@tiptap/extension'))
    ]
  }
}

const config = (devMode: boolean): InlineConfig => ({
  plugins: [
    optimizeCssModules() as Plugin,
    solidPlugin(),
    stylexPlugin(),
    imageOptimizer() as Plugin,
  ],
  optimizeDeps: {
    include: [
      // ...
    ]
  },
  server: {
    port: 1337
  },
  resolve: {
    alias: getAliasPath(__dirname)
  },
  ...getEsbuildConfig(devMode),
  cacheDir: internals.outDir,
  build: {
    outDir: internals.clientOutDir,
    rollupOptions: {
      output: rollupOutputOptions
    }
  },
})

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const devMode = command === "serve"

  return config(devMode)
})