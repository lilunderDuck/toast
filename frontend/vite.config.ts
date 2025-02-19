import { 
  defineConfig, 
  type Rollup, 
  type InlineConfig, 
  type Plugin,
  type ESBuildOptions,
} from 'vite'
// ...
import solidPlugin from 'vite-plugin-solid'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import { stylex as stylexPlugin } from 'vite-plugin-stylex-dev'
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer'
// @ts-ignore
import stripCodePlugin from 'vite-plugin-strip-code'
// ...
import tsconfig from './tsconfig.json'
import path from 'node:path'

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
 * @param config The tsconfig
 * @param basePath The base path from which to resolve relative paths within aliases.
 * @throws `Error` If an alias configuration contains more than one actual path, because
 * I have absolutely no idea what to do when it has 2 or more path.
 * @returns The resolved alias
 */
function getAliasPath(config: typeof tsconfig, basePath: string) {
  const configuredPath = config.compilerOptions.paths
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

function getEsbuildConfig(devMode: boolean, others?: ESBuildOptions): InlineConfig {
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
    drop: ['console', 'debugger'],
  }
  
  return {
    esbuild: {
      ...others,
      define: {
        "__devMode": `${devMode}`,
        "__version": `"1.0.0-beta"`,
        "__apiVersion": `"1.0.0-beta"`,
        "__backendVersion": `"golang v1.23.4"`,
      },
      ...dropConsoleSomethingCall,
      ...onlyManglePropsInProdMode
    },
  }
}

const BASE_OUTPUT_DIRECTORY = './out'
const OUTPUT_DIRECTORY = BASE_OUTPUT_DIRECTORY
const CLIENT_OUTPUT_DIRECTORY = `${BASE_OUTPUT_DIRECTORY}/static`

const rollupOutputOptions: Rollup.OutputOptions = {
  chunkFileNames: `[hash].js`,
  entryFileNames: "[hash].js",
  assetFileNames: "[hash].[ext]"
}

export default defineConfig(({ command }) => {
  const devMode = command === "serve"

  return {
    plugins: [
      optimizeCssModules() as Plugin,
      solidPlugin(),
      stylexPlugin(),
      imageOptimizer() as Plugin,
      stripCodePlugin({
        blocks: [
          {
            start: 'debug-start',
            end: 'debug-end',
            prefix: '//',
            suffix: '',
          },
        ],
      })
    ],
    optimizeDeps: {
      include: [
        // ...
      ]
    },
    server: {
      port: 1337
    },
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
    ...getEsbuildConfig(devMode),
    cacheDir: OUTPUT_DIRECTORY,
    build: {
      outDir: CLIENT_OUTPUT_DIRECTORY,
      rollupOptions: {
        output: rollupOutputOptions
      }
    }
  }
})