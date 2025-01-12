import type { ESBuildOptions, InlineConfig } from "vite"

export const getEsbuildConfig = (devMode: boolean, others?: ESBuildOptions): InlineConfig => ({
  esbuild: {
    ...others,
    define: {
      "__devMode": `${devMode}`,
      "__version": `"1.0.0-beta"`,
      "__apiVersion": `"1.0.0-beta"`,
      "__backendVersion": `"node-${process.version}"`,
    },
    // drop "console.(something)" call and "debugger" on production
    // ...(devMode ? {/* nothing here... */} : {
    //   drop: ['console', 'debugger'],
    // })
  },
})