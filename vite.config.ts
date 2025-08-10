import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import pagesPlugin from 'vite-plugin-pages'
import { stylex as stylexPlugin } from "vite-plugin-stylex-dev"
import { optimizeCssModules } from "vite-plugin-optimize-css-modules"
// ... 
import tsconfig from './tsconfig.json'
import { defineAllEnum, getAliasPath } from "./build/config"

export default defineConfig(() => {
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
      optimizeCssModules()
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
        output: {
          assetFileNames: "[hash].[ext]",
          chunkFileNames: "[hash].js",
          entryFileNames: "[hash].js",
        }
      }
    },
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
  }
})