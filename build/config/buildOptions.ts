import type { Rollup, ESBuildOptions } from "vite"

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