import type { ESBuildOptions, InlineConfig } from "vite"

export function getEsbuildConfig(devMode: boolean, others?: ESBuildOptions): InlineConfig {
  const onlyManglePropsInProdMode: ESBuildOptions = devMode ? {} : {
    // break app unexpectedly, won't enable this until find a new way
    // update: new way discovered - write my own props mangler instead.
    // mangleProps: PROP_ENDS_WITH_DOLLAR_SIGN,
    // mangleQuoted: true,
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true
  }

  // drop "console.(something)" call and "debugger" on production
  const dropConsoleSomethingCall: ESBuildOptions = devMode ? {/* nothing here... */} : {
    drop: ['console', 'debugger'],
  }
  
  return {
    esbuild: {
      ...others,
      ...dropConsoleSomethingCall,
      ...onlyManglePropsInProdMode
    },
  }
}