import type { Rollup } from "vite"

export const BASE_OUTPUT_DIRECTORY = './build'
export const OUTPUT_DIRECTORY = `${BASE_OUTPUT_DIRECTORY}/out`
export const CLIENT_OUTPUT_DIRECTORY = `${OUTPUT_DIRECTORY}/static`

export const rollupOutputOptions: Rollup.OutputOptions = {
  chunkFileNames: `[hash].js`,
  entryFileNames: "[hash].js",
  assetFileNames: "[hash].[ext]"
}