import { defineConfig, type Rollup, type InlineConfig, Plugin } from 'vite'
// ...
import solidPlugin from 'vite-plugin-solid'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import { stylex as stylexPlugin } from 'vite-plugin-stylex-dev'
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer'
import macrosPlugin from 'unplugin-macros/vite'
// ...
// @ts-ignore
import babelImportAssertions from '@babel/plugin-syntax-import-assertions'
// ...
import { 
  getEsbuildConfig, 
  getAliasPath, 
  CLIENT_OUTPUT_DIRECTORY, 
  OUTPUT_DIRECTORY, 
  outPutFilenameConfig
} from './scripts/vite-stuff'
import tsconfig from './tsconfig.json'

const rollupOutputOptions: Rollup.OutputOptions = {
  ...outPutFilenameConfig,
  manualChunks: {
    codemirror: ['codemirror', '@codemirror/lang-css']
  }
}

const macroPlugin = macrosPlugin({
  viteConfig: {
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    }
  }
})

const config = (devMode: boolean): InlineConfig => ({
  plugins: [
    optimizeCssModules() as Plugin,
    solidPlugin({
      babel: {
        plugins: [
          babelImportAssertions
        ]
      },
    }),
    stylexPlugin(),
    imageOptimizer() as Plugin,
    macroPlugin,
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
    alias: getAliasPath(tsconfig, __dirname)
  },
  ...getEsbuildConfig(devMode),
  cacheDir: OUTPUT_DIRECTORY,
  build: {
    outDir: CLIENT_OUTPUT_DIRECTORY,
    rollupOptions: {
      output: rollupOutputOptions
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const devMode = command === "serve"

  return config(devMode)
})