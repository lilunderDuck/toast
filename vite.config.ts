import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import pagesPlugin from 'vite-plugin-pages'
import { stylex as stylexPlugin } from "vite-plugin-stylex-dev"
import { optimizeCssModules } from "vite-plugin-optimize-css-modules"
// ... 
import tsconfig from './tsconfig.json'
import { defineAllConstants, getAliasPath, ESBUILD_OPTIONS, OUTPUT_FILENAME, macroPlugin, DEV_OPTIMIZE_OPTIONS, generateConstsTypeThenSave } from "./build/config"

export default defineConfig(({ command }) => {
  const isDevMode = command !== "build"
  const BUILD_SAVED_PATH = "./build/out/bin/app"
  const mapping = defineAllConstants(isDevMode)
  const definedMapping = generateConstsTypeThenSave(mapping)

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
    server: {
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