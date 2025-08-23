import type { ESBuildOptions } from "vite"

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