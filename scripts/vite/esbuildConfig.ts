import type { ESBuildOptions, InlineConfig } from "vite"

export const getEsbuildConfig = (devMode: boolean, others?: ESBuildOptions): InlineConfig => ({
  esbuild: {
    ...others,
    define: {
      "__devMode": `${devMode}`,
    },
    // drop "console.(something)" call and "debugger" on production
    ...(devMode ? {
      // nothing here...
    } : {
      drop: ['console', 'debugger'],
    })
    // mangleProps: devMode ? undefined : /\$([a-zA-Z0-9]|_){3,}/gm,
  },
})