import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import pagesPlugin from 'vite-plugin-pages'
import { stylex as stylexPlugin } from "vite-plugin-stylex-dev"
import { optimizeCssModules } from "vite-plugin-optimize-css-modules"
// ... 
import tsconfig from './tsconfig.json'
import { getAliasPath, ESBUILD_OPTIONS, OUTPUT_FILENAME, DEV_OPTIMIZE_OPTIONS, generateConstsTypeThenSave, defineAllConstants } from "./addon/config"
import { macroPlugin } from './addon/macro'

// Make sure to update the code in ./backend/internals/path.go if you're planning
// to change this variable and vice versa
const BUILD_SAVED_PATH = "./build/out/bin/resource"

export default defineConfig(({ command }) => {
  const isDevMode = command !== "build"

  defineAllConstants(isDevMode)
  const definedMapping = generateConstsTypeThenSave()

  return {
    plugins: [
      pagesPlugin({
        dirs: ['./frontend/pages'],
      }),
      solidPlugin(),
      stylexPlugin(),
      optimizeCssModules(),
      macroPlugin
    ],
    // Windows 11 workaround: for some goddamn reason, in a windows 10 enviroment, this config
    // is fine, but in windows 11, it has this error in wails:
    //    ERR | [ExternalAssetHandler] Proxy error: EOF
    //
    // Even more confusingly, the console gave me these error:
    //    Failed to load resource: the server responded with a status of 502 (Bad Gateway)
    //    Uncaught (in promise) TypeError: Failed to fetch dynamically imported module: [...]
    // 
    // On my god, this took me way too long to fix this goddamn issue, AUGHHH!!!
    //
    // Maybe there's something changed between windows 10 and 11, but WHY???
    // I hate you, microsoft.
    base: "/",
    server: {
      host: '127.0.0.1', 
      strictPort: true,
    // ----------------------------------------------------------------
      port: 3000,
      watch: {
        // make sure any wails stuff excluded from the watch list
        // so vite doesn't crash randomly on dev mode.
        ignored: ["**/*.syso", "**/out/*"]
      }
    },
    define: definedMapping,
    publicDir: "./frontend/public/",
    optimizeDeps: DEV_OPTIMIZE_OPTIONS,
    build: {
      target: 'esnext',
      outDir: BUILD_SAVED_PATH,
      rollupOptions: {
        output: OUTPUT_FILENAME
      }
    },
    esbuild: isDevMode ? undefined : ESBUILD_OPTIONS,
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
  }
})