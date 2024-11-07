export const internals = (() => {
  const OUTPUT_DIRECTORY = './out'

  return {
    outDir: OUTPUT_DIRECTORY,
    serverOutDir: `${OUTPUT_DIRECTORY}/server`,
    clientOutDir: `${OUTPUT_DIRECTORY}/server/resource`,
  } as const
})()

export const outPutFilenameConfig = {
  chunkFileNames: `[hash].js`,
  entryFileNames: "[hash].js",
  assetFileNames: "assets/[hash].[ext]",
}