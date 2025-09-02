import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import pagesPlugin from 'vite-plugin-pages'
import { stylex as stylexPlugin } from "vite-plugin-stylex-dev"
// ... 
import tsconfig from './tsconfig.json'
import { defineAllEnum, getAliasPath, ESBUILD_OPTIONS, OUTPUT_FILENAME, macroPlugin } from "./build/config"

export default defineConfig(({ command }) => {
  const isDevMode = command !== "build"
  const BUILD_SAVED_PATH = "./build/out/bin/app"
  const { generateType, getDefineList } = defineAllEnum()

  generateType()

  return {
    plugins: [
      pagesPlugin({
        dirs: ['./frontend/pages'],
      }),
      solidPlugin(),
      stylexPlugin(),
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
    define: getDefineList(),
    publicDir: "./frontend/public/",
    optimizeDeps: {
      // for some reason adding all of these packages, the error gone
      include: [
        "@tiptap/core",
        "@tiptap/extension-bubble-menu",
        "@tiptap/extension-code-block-lowlight",
        "@tiptap/extension-color",
        "@tiptap/extension-floating-menu",
        "@tiptap/extension-highlight",
        "@tiptap/extension-link",
        "@tiptap/extension-placeholder",
        "@tiptap/extension-subscript",
        "@tiptap/extension-superscript",
        "@tiptap/extension-table",
        "@tiptap/extension-table-cell",
        "@tiptap/extension-table-header",
        "@tiptap/extension-table-row",
        "@tiptap/extension-task-item",
        "@tiptap/extension-task-list",
        "@tiptap/extension-text-style",
        "@tiptap/extension-underline",
        "@tiptap/starter-kit",
      ]
    },
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