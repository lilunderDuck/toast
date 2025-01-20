import path from 'node:path'
// ...
import { 
  type ESBuildOptions, 
  type InlineConfig,
  type BuildOptions
} from "vite"
import type this_tsconfig from './tsconfig.json'

type RollupOptions = NonNullable<BuildOptions["rollupOptions"]>

/**Extracts and resolves aliases from a TypeScript configuration file (`tsconfig.json`).
 * ```
 * import tsconfig from 'path/to/tsconfig.json'
 * const aliases = getAliasPath(process.cwd())
 * console.log(aliases)
 * // Output (example):
 * // {
 * //   '@utils': '/path/to/src/utils',
 * //   '@components': '/path/to/src/components'
 * // }
 * ```
 * @param tsconfig The tsconfig
 * @param basePath The base path from which to resolve relative paths within aliases.
 * @throws `Error` If an alias configuration contains more than one actual path, because
 * I have absolutely no idea what to do when it has 2 or more path.
 * @returns The resolved alias
 */
export function getAliasPath(tsconfig: typeof this_tsconfig, basePath: string) {
  const configuredPath = tsconfig.compilerOptions.paths
  const alias: Record<string, string> = {}
  
  for (let [pathAlias, acturalPath] of Object.entries(configuredPath)) {
    if (acturalPath.length > 1) {
      throw new Error('panic: alias path should not have more than 1 actural path')
    }
    pathAlias = pathAlias.replace('/*', '')
    acturalPath = acturalPath.map(it => (
      path.resolve(basePath, it.replace('/*', ''))
    ))

    alias[pathAlias] = acturalPath.join('')

    // Just gonna console log it out in case it returns some weird result
    console.log(pathAlias, '\twill be resolved to', acturalPath)
  }

  return alias
}

export function getEsbuildConfig(devMode: boolean, others?: ESBuildOptions): InlineConfig {
  // break app unexpectedly, won't enable this until find a new way
  // const PROP_ENDS_WITH_DOLLAR_SIGN = /\$$/
  const onlyManglePropsInProdMode: ESBuildOptions = devMode ? {} : {
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
    // drop: ['console', 'debugger'],
  }
  
  return {
    esbuild: {
      ...others,
      define: {
        "__devMode": `${devMode}`,
        "__version": `"1.0.0-beta"`,
        "__apiVersion": `"1.0.0-beta"`,
        "__backendVersion": `"${`deno-${Deno.version.deno}, ts-${Deno.version.typescript}, v8-${Deno.version.v8}`}"`,
      },
      ...dropConsoleSomethingCall,
      ...onlyManglePropsInProdMode
    },
  }
}

const BASE_OUTPUT_DIRECTORY = './out'
export const OUTPUT_DIRECTORY = BASE_OUTPUT_DIRECTORY
export const SERVER_OUTPUT_DIRECTORY = `${BASE_OUTPUT_DIRECTORY}/server`
export const CLIENT_OUTPUT_DIRECTORY = `${BASE_OUTPUT_DIRECTORY}/server/static`

export const outPutFilenameConfig: RollupOptions["output"] = {
  chunkFileNames: `[hash].js`,
  entryFileNames: "[hash].js",
  assetFileNames: "[hash].[ext]",
}