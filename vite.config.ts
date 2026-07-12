import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import pagesPlugin from 'vite-plugin-pages'
import { optimizeCssModules } from "vite-plugin-optimize-css-modules"
import molcss from 'molcss/vite-plugin'
// ... 
import tsconfig from './tsconfig.json'
import { getAliasPath, ESBUILD_OPTIONS, OUTPUT_FILENAME, generateConstsTypeThenSave, defineAllConstants } from "./config"
import { macroPlugin } from "./build/scripts/macros.js"

// Make sure to update the code in ./backend/internals/path.go if you're planning
// to change this variable and vice versa
const BUILD_SAVED_PATH = "./build/dist/app"

export default defineConfig(({ command }) => {
  const TOAST_DEBUG = command !== "build"

  defineAllConstants(TOAST_DEBUG)
  const definedMapping = generateConstsTypeThenSave()

  return {
    plugins: [
      molcss({
        content: 'frontend/**/*.{js,jsx,ts,tsx}',
      }),
      pagesPlugin({
        dirs: ['./frontend/pages'],
      }),
      solidPlugin(),
      optimizeCssModules(),
      macroPlugin("./build/dist/macro_def.d.ts", TOAST_DEBUG)
    ],
    base: "/",
    server: {
      host: '127.0.0.1', 
      strictPort: true,
      port: 3000,
      watch: {
        // make sure any wails stuff excluded from the watch list
        // so vite doesn't crash randomly on dev mode.
        ignored: ["**/*.syso", "**/build/*", "**/backend/*"]
      }
    },
    define: definedMapping,
    publicDir: "./frontend/public/",
    build: {
      target: 'esnext',
      outDir: BUILD_SAVED_PATH,
      rollupOptions: {
        output: OUTPUT_FILENAME
      }
    },
    esbuild: TOAST_DEBUG ? undefined : ESBUILD_OPTIONS,
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
  }
})