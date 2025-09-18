import type { Rollup, ESBuildOptions, UserConfig } from "vite"

export const BASE_OUTPUT_DIRECTORY = './build'
export const OUTPUT_DIRECTORY = `${BASE_OUTPUT_DIRECTORY}/out`
export const CLIENT_OUTPUT_DIRECTORY = `${OUTPUT_DIRECTORY}/static`

function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const MAX_LENGTH = 3

export const OUTPUT_FILENAME: Rollup.OutputOptions = {
  assetFileNames: () => `${generateRandomString(MAX_LENGTH)}.[ext]`,
  chunkFileNames: () => `${generateRandomString(MAX_LENGTH)}.js`,
  entryFileNames: () => `${generateRandomString(MAX_LENGTH)}.js`,
}

export const ESBUILD_OPTIONS: ESBuildOptions = {
  // break app unexpectedly, won't enable this until find a new way
  // update: new way discovered - write my own props mangler instead.
  // mangleProps: PROP_ENDS_WITH_DOLLAR_SIGN,
  // mangleQuoted: true,
  legalComments: 'none',
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  treeShaking: true,
  drop: ['console', 'debugger']
}

export const DEV_OPTIMIZE_OPTIONS: UserConfig["optimizeDeps"] = {
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
}